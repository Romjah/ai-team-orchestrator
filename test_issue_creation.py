```python
"""
Tests for automatic issue creation functionality.

This module contains comprehensive tests to validate the automatic issue creation process
under various conditions and edge cases.
"""

import pytest
from unittest.mock import patch
from your_module import create_issue  # Replace with actual module path

@pytest.mark.usefixtures("clean_database")
class TestIssueCreation:
    """
    Test suite for issue creation functionality.
    """
    
    @pytest.mark.parametrize("title,description,priority,status,expected_issue", [
        ("Test Issue", "This is a test description", "high", "open", {
            "title": "Test Issue",
            "description": "This is a test description",
            "priority": "high",
            "status": "open"
        }),
        ("Another Test", "Another test description", "low", "in_progress", {
            "title": "Another Test",
            "description": "Another test description",
            "priority": "low",
            "status": "in_progress"
        }),
    ])
    def test_create_valid_issue(self, title, description, priority, status, expected_issue):
        """
        Test successful creation of an issue with valid parameters.
        """
        # Act
        issue = create_issue(title, description, priority, status)
        
        # Assert
        assert issue == expected_issue
        assert isinstance(issue, dict)
        assert "id" in issue  # Assuming issue has an id

    def test_create_issue_with_missing_required_fields(self):
        """
        Test issue creation with missing required fields.
        """
        # Act & Assert
        with pytest.raises(ValueError):
            create_issue("", "Test description", "high", "open")

    @pytest.mark.parametrize("title,description,priority,status", [
        ("", "", "", ""),  # All fields empty
        ("Too long" * 100, "Description too long" * 100, "invalid_priority", "invalid_status")
    ])
    def test_create_issue_with_invalid_parameters(self, title, description, priority, status):
        """
        Test issue creation with invalid parameters.
        """
        # Act & Assert
        with pytest.raises(ValueError):
            create_issue(title, description, priority, status)

    @patch("your_module.create_issue")  # Replace with actual module path
    def test_create_issue_with_external_dependency_failure(self, mock_create_issue):
        """
        Test issue creation when external dependencies fail.
        """
        # Arrange
        mock_create_issue.side_effect = Exception("External service unavailable")
        
        # Act & Assert
        with pytest.raises(Exception):
            create_issue("Test Issue", "Test description", "high", "open")

def create_issue(title, description, priority, status):
    """
    Helper function to create an issue.
    
    Args:
        title (str): Issue title
        description (str): Issue description
        priority (str): Issue priority
        status (str): Issue status
    
    Returns:
        dict: Created issue object
    
    Raises:
        ValueError: If required fields are missing or invalid
    """
    if not title or not description:
        raise ValueError("Title and description are required")
    
    if priority not in ["low", "medium", "high"]:
        raise ValueError("Invalid priority")
    
    if status not in ["open", "in_progress", "closed"]:
        raise ValueError("Invalid status")
    
    # Simulate issue creation
    return {
        "id": 1,
        "title": title,
        "description": description,
        "priority": priority,
        "status": status
    }
```
