#!/usr/bin/env python3
import os
import re
from pathlib import Path
import argparse
from typing import List, Tuple, Pattern

class APIKeyScanner:
    """
    Scan for potential API keys in files.

    Usage:
    python scan_for_keys.py <path_to_file_or_directory> [--exclude <directories>]

    Example:
    python scan_for_keys.py . --exclude node_modules venv  # Scan current directory excluding node_modules and venv
    """
    def __init__(self):
        # Common API key patterns
        self.patterns = [
            (r'sk-[a-zA-Z0-9]{48}', 'OpenAI API Key'),
            (r'ghp_[a-zA-Z0-9]{36}', 'GitHub Personal Access Token'),
            #(r'[a-zA-Z0-9]{32}', 'Generic API Key'),
            (r'amazonaws\.com.+[a-zA-Z0-9/+]{40}', 'AWS Access Key'),
           # (r'[a-z0-9]{32}-us[0-9]{1,2}', 'MailChimp API Key'),
            #(r'key-[a-zA-Z0-9]{32}', 'Generic Private Key'),
            #(r'[a-zA-Z0-9_-]{24}', 'Generic Secret Key'),
        ]
        self.compiled_patterns = [(re.compile(pattern), desc) for pattern, desc in self.patterns]

    def is_binary_file(self, file_path: str) -> bool:
        """Check if a file is binary."""
        try:
            with open(file_path, 'tr') as check_file:
                check_file.read(1024)
                return False
        except UnicodeDecodeError:
            return True
        
    def scan_file(self, file_path: str) -> List[Tuple[str, str, int, str]]:
        """Scan a single file for API keys."""
        if self.is_binary_file(file_path):
            return []
        
        findings = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for i, line in enumerate(f, 1):
                    for pattern, desc in self.compiled_patterns:
                        matches = pattern.finditer(line)
                        for match in matches:
                            findings.append((
                                file_path,
                                match.group(),
                                i,
                                desc
                            ))
        except Exception as e:
            print(f"Error scanning {file_path}: {str(e)}")
        return findings

    def scan_directory(self, start_path: str, exclude_dirs: List[str] = None) -> List[Tuple[str, str, int, str]]:
        """Recursively scan a directory for API keys."""
        if exclude_dirs is None:
            exclude_dirs = ['.git', 'node_modules', 'venv', '.env']
            
        all_findings = []
        
        for root, dirs, files in os.walk(start_path):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                file_path = os.path.join(root, file)
                findings = self.scan_file(file_path)
                all_findings.extend(findings)
                
        return all_findings

def main():
    parser = argparse.ArgumentParser(description='Scan for potential API keys in files')
    parser.add_argument('path', help='Path to file or directory to scan')
    parser.add_argument('--exclude', nargs='+', help='Directories to exclude from scan',
                      default=['.git', 'node_modules', 'venv', '.env'])
    args = parser.parse_args()

    scanner = APIKeyScanner()
    
    if os.path.isfile(args.path):
        findings = scanner.scan_file(args.path)
    else:
        findings = scanner.scan_directory(args.path, args.exclude)

    if findings:
        print("\n=== Potential API Keys Found ===")
        for file_path, key, line_num, desc in findings:
            print(f"\nFile: {file_path}")
            print(f"Line: {line_num}")
            print(f"Type: {desc}")
            print(f"Found: {key}")
        print("\nWarning: Please verify these findings manually as there might be false positives.")
    else:
        print("No API keys found.")

if __name__ == "__main__":
    main()