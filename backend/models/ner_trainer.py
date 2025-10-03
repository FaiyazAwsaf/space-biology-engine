import os
import json
from datasets import load_from_disk
from transformers import (
    AutoTokenizer,
    AutoModelForTokenClassification,
    TrainingArguments,
    Trainer,
    DataCollatorForTokenClassification
)
import numpy as np
import evaluate
import transformers
try:
    import torch
except ImportError:
    torch = None

# --- Configuration ---
MODEL_CHECKPOINT = "distilbert-base-uncased"
DATA_DIR = r"C:\Users\Sameer Roy\Desktop\nsac\data\data"  # Folder containing labels.json, train.pt, eval.pt
OUTPUT_MODEL_DIR = './models/ner_v1_15papers'  # Where the trained model will be saved

# Load the label mapping created in the data_processor.py script
try:
    with open(os.path.join(DATA_DIR, 'labels.json'), 'r') as f:
        id_to_label = json.load(f)
    id_to_label = {int(k): v for k, v in id_to_label.items()}
    label_to_id = {v: k for k, v in id_to_label.items()}
    NUM_LABELS = len(id_to_label)
    print(f"Loaded {NUM_LABELS} labels.")
except FileNotFoundError:
    print("FATAL ERROR: labels.json not found. Run data_processor.py first.")
    exit()

# --- Metrics Setup ---
metric = evaluate.load("seqeval")

def compute_metrics(eval_preds):
    logits, labels = eval_preds
    predictions = np.argmax(logits, axis=-1)

    # Align predictions and labels, skipping -100
    true_labels = [[id_to_label[l] for l in label if l != -100] for label in labels]
    true_predictions = [
        [id_to_label[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]

    results = metric.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }

# --- TrainingArguments helper ---
def get_training_args():
    """
    Builds TrainingArguments using the most basic, universally supported arguments.
    
    This avoids arguments like 'evaluation_strategy', 'save_strategy', and 
    'load_best_model_at_end' that cause TypeErrors in older transformers versions.
    """
    # Note: We are using a basic configuration to prevent the TypeError.
    # To re-enable features like automatic per-epoch evaluation, you must update 
    # your 'transformers' library to version 4.30 or newer.
    
    has_cuda = torch and torch.cuda.is_available()

    print(f"🛠️ Using basic TrainingArguments configuration to bypass TypeError.")
    return TrainingArguments(
        output_dir=OUTPUT_MODEL_DIR,
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        weight_decay=0.01,
        # Using basic logging/save steps for compatibility
        logging_steps=500,
        save_steps=500,
        fp16=has_cuda,
        report_to="none"
    )

# --- Main Training Function ---
def train_ner_model():
    print("--- Phase II, Step 4: Model Training Started ---")

    # 1. Load Data
    try:
        train_dataset = load_from_disk(os.path.join(DATA_DIR, 'train.pt'))
        eval_dataset = load_from_disk(os.path.join(DATA_DIR, 'eval.pt'))
        print("Datasets loaded successfully.")
    except FileNotFoundError:
        print(f"FATAL ERROR: Training files not found in {DATA_DIR}. Run data_processor.py first.")
        return

    # 2. Load Tokenizer and Model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
    model = AutoModelForTokenClassification.from_pretrained(
        MODEL_CHECKPOINT,
        num_labels=NUM_LABELS,
        id2label=id_to_label,
        label2id=label_to_id
    )
    print(f"Model {MODEL_CHECKPOINT} loaded with {NUM_LABELS} labels.")

    # 3. Define Training Arguments (version-safe)
    training_args = get_training_args()

    # 4. Data Collator
    data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)

    # 5. Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )

    # 6. Train
    print("Starting training...")
    trainer.train()

    # 7. Save final model
    trainer.save_model(OUTPUT_MODEL_DIR)
    tokenizer.save_pretrained(OUTPUT_MODEL_DIR)
    print(f"✅ Training complete. Final model saved to: {OUTPUT_MODEL_DIR}")

if __name__ == '__main__':
    os.makedirs(OUTPUT_MODEL_DIR, exist_ok=True)
    train_ner_model()

