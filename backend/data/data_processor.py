import os
import json
from datasets import Dataset
from transformers import AutoTokenizer

# --- Configuration ---
CONLL_FILE = 'labeled_data_15_papers.conll' 
OUTPUT_DIR = 'data'
MODEL_CHECKPOINT = "distilbert-base-uncased"  # Match the trainer script


def get_iob_tags_from_conll(file_path):
    """
    Reads the CoNLL file and extracts unique IOB tags (e.g., B-Methodology, I-Dataset, O).
    """
    tags = set()
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('-DOCSTART-'):
                parts = line.split()
                if len(parts) == 2:
                    tags.add(parts[1])
    # Ensure 'O' (Outside) is always included
    if 'O' not in tags:
        tags.add('O')
    return sorted(list(tags))  # sorted for consistent mapping


def tokenize_and_align_labels(examples, tokenizer, label_to_id):
    """
    Tokenizes the text and aligns the NER labels to the new tokenized list.
    This is necessary because BERT tokenizers break words into sub-words (tokens).
    """
    tokenized_inputs = tokenizer(examples["tokens"], truncation=True, is_split_into_words=True)

    labels = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx == previous_word_idx:
                label_ids.append(-100)
            else:
                label_tag = label[word_idx]
                label_ids.append(label_to_id[label_tag])
            previous_word_idx = word_idx
        labels.append(label_ids)

    tokenized_inputs["labels"] = labels
    return tokenized_inputs


if __name__ == '__main__':
    print("--- Phase II, Step 3: Data Processing Started ---")

    if not os.path.exists(CONLL_FILE):
        print(f"FATAL ERROR: CoNLL file not found at '{CONLL_FILE}'.")
        print("Please ensure you have exported your labeled data from Label Studio in CoNLL format and named it 'labeled_data_15_papers.conll'.")
        exit()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. Determine all unique labels
    tag_names = get_iob_tags_from_conll(CONLL_FILE)
    id_to_label = {i: tag for i, tag in enumerate(tag_names)}
    label_to_id = {tag: i for i, tag in enumerate(tag_names)}
    print(f"Found {len(tag_names)} unique IOB tags: {tag_names}")

    with open(os.path.join(OUTPUT_DIR, 'labels.json'), 'w') as f:
        json.dump(id_to_label, f, indent=2)
    print(f"Label map saved to {OUTPUT_DIR}/labels.json")

    # 2. Parse CoNLL file manually (skip Hugging Face conll2003)
    try:
        tokens_list = []
        tags_list = []

        current_tokens = []
        current_tags = []

        with open(CONLL_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('-DOCSTART-'):
                    if current_tokens:
                        tokens_list.append(current_tokens)
                        tags_list.append(current_tags)
                    current_tokens = []
                    current_tags = []
                else:
                    parts = line.split()
                    if len(parts) == 2:
                        current_tokens.append(parts[0])
                        current_tags.append(parts[1])
            if current_tokens:
                tokens_list.append(current_tokens)
                tags_list.append(current_tags)

        raw_datasets = Dataset.from_dict({'tokens': tokens_list, 'ner_tags': tags_list})

    except Exception as e:
        print(f"FATAL ERROR: Failed to load and parse the CoNLL file. Check file format: {e}")
        exit()

    # 3. Split into training and evaluation sets
    split_datasets = raw_datasets.train_test_split(test_size=0.2, seed=42)
    print(f"Data split: Train={len(split_datasets['train'])}, Test={len(split_datasets['test'])}")

    # 4. Tokenize and Align Labels
    tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)

    tokenized_datasets = split_datasets.map(
        lambda examples: tokenize_and_align_labels(examples, tokenizer, label_to_id),
        batched=True
    )
    print("Tokenization and label alignment complete.")

    # 5. Save processed datasets
    tokenized_datasets['train'].save_to_disk(os.path.join(OUTPUT_DIR, 'train.pt'))
    tokenized_datasets['test'].save_to_disk(os.path.join(OUTPUT_DIR, 'eval.pt'))
    print(f"✅ Processed data saved to {OUTPUT_DIR}/.")

