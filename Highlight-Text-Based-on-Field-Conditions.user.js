// ==UserScript==
// @name         Highlight Field Based on Field Conditions
// @namespace    Migrant Workers Centre
// @version      0.95d
// @description  Highlight Field Based on Field Conditions
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Highlight-Text-Based-on-Field-Conditions.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Highlight-Text-Based-on-Field-Conditions.user.js
// ==/UserScript==

(function() {
  'use strict';

  const fieldMap = {
    'Visa': {
        targetIds: ['Visa_detail'],
        conditions: ['*bridging*'],
        message: '',
    },
    'Disadvantage_indicators-has_dependants': {
        targetIds: ['Disadvantage_indicators-number_of_dependants'],
        conditions: ['checked'],
        message: '',
    },
    'Disadvantage_indicators-centrelink': {
        targetIds: ['Disadvantage_indicators-centrelink_type'],
        conditions: ['checked'],
        message: '',
    },
    'Disadvantage_indicators-disability': {
        targetIds: ['Disadvantage_indicators-disability_type'],
        conditions: ['checked'],
        message: '',
    },
    'Source': {
        targetIds: ['Source_name'],
        conditions: ['I was referred by another organisation'],
        message: 'Please specify the organisation that provided the referral.'
    },
    'Employer_status': {
        targetIds: ['Termination-manner', 'Termination-date_description', 'Last_day_of_work_description'],
        conditions: ['I am not still employed by the employer and want advice about the end of my employment'],
        message: '',
    },
    'Issue_type': {
        targetIds: ['Injury-reported_to_employer', 'Injury-doctor_or_health_professional', 'Injury-certificate_of_capacity', 'Injury-date_noticed_description', 'Injury-date_occurred_description'],
        conditions: ['I was injured at work/my work has made me unwell'],
        message: '',
    },
    'Ideal_outcome': {
        targetIds: ['Ideal_outcome'],
        conditions: [''],
        message: '',
    },
    'Dates_and_deadlines': {
        targetIds: ['Dates_and_deadlines'],
        conditions: [''],
        message: '',
    },
    'Existing_legal_claims': {
        targetIds: ['Existing_legal_claims_detail'],
        conditions: ['Yes', 'I don\'t know/I\'m not sure'],
        message: '',
    },
    'Past_legal_assistance': {
        targetIds: ['Past_legal_assistance_detail'],
        conditions: ['Yes', 'I don\'t know/I\'m not sure'],
        message: '',
    },
    'Union_membership': {
        targetIds: ['Past_union_assistance'],
        conditions: ['Yes'],
        message: '',
    },
    'Past_union_assistance': {
        targetIds: ['Past_union_assistance_detail'],
        conditions: ['Yes'],
        message: '',
    },
    'Other_parties': {
        targetIds: ['Other_parties'],
        conditions: [''],
        message: '',
    },
  };

  function highlightField(element) {
    element.style.backgroundColor = '#daedcf';
    element.style.borderColor = '#589e29';
  }

  function removeHighlight(element) {
    element.style.backgroundColor = '';
    element.style.borderColor = '';
  }

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

  function removeMessage(targetElement) {
    let messageElement = targetElement.nextElementSibling;
    if (messageElement && messageElement.classList.contains('custom-message')) {
      messageElement.remove();
    }
  }

  function checkFieldAndHighlight(fieldId, targetIds, conditions, message) {
    const field = document.getElementById(fieldId);

    if (field) {
      let isConditionMet = false;

      if (field.tagName === 'SELECT') {
        const selectedOptions = Array.from(field.selectedOptions);
        isConditionMet = selectedOptions.some(option => matchCondition(option.value, conditions));
      } else if (field.type === 'checkbox') {
        isConditionMet = field.checked && matchCondition('checked', conditions);
      } else if (field.type === 'text' || field.type === 'textarea') {
        isConditionMet = matchCondition(field.value.trim(), conditions);
      } else if (field.tagName === 'SPAN') {
        isConditionMet = matchCondition(field.textContent.trim(), conditions);
      }

      targetIds.forEach(targetId => {
        let fieldToHighlight = document.getElementById(targetId);

        if (targetId.endsWith('_description') && fieldToHighlight) {
          const parentTd = fieldToHighlight.closest('td');
          if (parentTd) {
            fieldToHighlight = parentTd.querySelector('.DateControl_DateInputBox');
          }
        }

        if (fieldToHighlight) {
          const fieldValue = fieldToHighlight.value ? fieldToHighlight.value.trim() : '';
          if (isConditionMet && fieldValue === '') {
            highlightField(fieldToHighlight);
            if (message) displayMessage(fieldToHighlight, message);
          } else {
            removeHighlight(fieldToHighlight);
            if (message) removeMessage(fieldToHighlight);
          }
        }
      });
    }
  }

  function matchCondition(value, conditions) {
    return conditions.some(condition => {
      if (condition.startsWith('!')) {
        return !matchWildcard(value, condition.slice(1));
      }
      return matchWildcard(value, condition);
    });
  }

  function matchWildcard(value, condition) {
    const regex = new RegExp('^' + condition.replace(/\*/g, '.*') + '$');
    return regex.test(value);
  }

  function initHighlighting() {
    for (const fieldId in fieldMap) {
      const { targetIds, conditions, message } = fieldMap[fieldId];
      checkFieldAndHighlight(fieldId, targetIds, conditions, message);
    }

    for (const fieldId in fieldMap) {
      const { targetIds, conditions, message } = fieldMap[fieldId];
      const field = document.getElementById(fieldId);

      if (field) {
        field.addEventListener('change', () => checkFieldAndHighlight(fieldId, targetIds, conditions, message));
        if (field.type === 'text' || field.type === 'textarea') {
          field.addEventListener('input', () => checkFieldAndHighlight(fieldId, targetIds, conditions, message));
        }
      }

      targetIds.forEach(targetId => {
        const fieldToHighlight = document.getElementById(targetId);
        if (fieldToHighlight) {
          fieldToHighlight.addEventListener('input', () => checkFieldAndHighlight(fieldId, targetIds, conditions, message));
          fieldToHighlight.addEventListener('change', () => checkFieldAndHighlight(fieldId, targetIds, conditions, message));
        }
      });
    }
  }

  initHighlighting();
})();
