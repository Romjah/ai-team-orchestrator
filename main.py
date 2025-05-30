```python
def process_real_issue(issue_id: str) -> bool:
    """
    Processes a real-world issue and determines if it should be handled.
    
    Args:
        issue_id: Unique identifier for the issue
        
    Returns:
        bool: True if the issue was processed successfully, False otherwise
        
    Raises:
        ValueError: If the issue_id is invalid
        RuntimeError: If there's an unexpected error processing the issue
    """
    try:
        # Validate input
        if not isinstance(issue_id, str) or not issue_id.strip():
            raise ValueError("Invalid issue_id provided")
            
        # Simulate real-world issue processing
        # Replace this with actual implementation
        print(f"Processing real issue: {issue_id}")
        return True
        
    except ValueError as ve:
        print(f"Validation error: {ve}")
        raise
    except Exception as e:
        print(f"Unexpected error processing issue: {e}")
        raise RuntimeError("Failed to process issue") from e

def main():
    """
    Main function that demonstrates the real issue processing
    """
    try:
        # Example usage
        success = process_real_issue("ISSUE-123")
        print(f"Processing result: {success}")
    except Exception as e:
        print(f"Main execution failed: {e}")
        return 1
    return 0

if __name__ == "__main__":
    exit(main())
```
