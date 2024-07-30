// ==UserScript==
// @name         Highlight Text Based on Dropdown Selection
// @namespace    Migrant Workers Centre
// @version      0.9
// @description  Highlight text based on dropdown selection
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// ==/UserScript==

(function() {
  'use strict';

  // Map of dropdown IDs and associated text field IDs
  const dropdownMap = {
    'Source': {
        targetId: 'Source_name',
        conditions: ['I was referred by another organisation'],
        message: 'Please specify the organisation that provided the referral.'
    },
    'Past_legal_assistance': {
        targetId: 'Past_legal_assistance_detail',
        conditions: ['Yes', 'No'],
        message: '',
    },
    'Past_union_assistance': {
        targetId: 'Past_union_assistance_detail',
        conditions: ['Yes'],
        message: '',
    },
  };

  // Function to highlight text
  function highlightField(element) {
    element.style.backgroundColor = '#daedcf';
  }

  // Function to remove highlight
  function removeHighlight(element) {
    element.style.backgroundColor = '';
  }

  // Function to display a message below the target field
  function displayMessage(targetElement, message) {
    let messageElement = targetElement.nextElementSibling;
    if (!messageElement || !messageElement.classList.contains('custom-message')) {
      messageElement = document.createElement('div');
      messageElement.className = 'custom-message';
      messageElement.style.color = 'red';
      targetElement.parentNode.insertBefore(messageElement, targetElement.nextSibling);
    }
    messageElement.textContent = message;
  }

  // Function to remove the message below the target field
  function removeMessage(targetElement) {
    let messageElement = targetElement.nextElementSibling;
    if (messageElement && messageElement.classList.contains('custom-message')) {
      messageElement.remove();
    }
  }

  // Function to check a dropdown and highlight associated text
  function checkDropdownAndHighlight(dropdownId, targetId, conditions, message) {
    const dropdown = document.getElementById(dropdownId);
    const fieldToHighlight = document.getElementById(targetId);

    if (dropdown && fieldToHighlight) {
      const fieldValue = fieldToHighlight.value ? fieldToHighlight.value.trim() : '';
      if (conditions.includes(dropdown.value) && fieldValue === '') {
        highlightField(fieldToHighlight);
        if (message) displayMessage(fieldToHighlight, message);
      } else {
        removeHighlight(fieldToHighlight);
        if (message) removeMessage(fieldToHighlight);
      }
    }
  }

  // Run the function on page load for each dropdown-text pair
  for (const dropdownId in dropdownMap) {
    const { targetId, conditions, message } = dropdownMap[dropdownId];
    checkDropdownAndHighlight(dropdownId, targetId, conditions, message);
  }

  // Add event listeners to dropdowns and text fields
  for (const dropdownId in dropdownMap) {
    const { targetId, conditions, message } = dropdownMap[dropdownId];
    const dropdown = document.getElementById(dropdownId);
    const fieldToHighlight = document.getElementById(targetId);

    if (dropdown) {
      dropdown.addEventListener('change', () => checkDropdownAndHighlight(dropdownId, targetId, conditions, message));
    }

    if (fieldToHighlight) {
      fieldToHighlight.addEventListener('input', () => checkDropdownAndHighlight(dropdownId, targetId, conditions, message)); // For text fields
      fieldToHighlight.addEventListener('change', () => checkDropdownAndHighlight(dropdownId, targetId, conditions, message)); // For other fields
    }
  }
})();