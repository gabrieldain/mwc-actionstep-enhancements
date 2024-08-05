// ==UserScript==
// @name         Hide and Highlight Fields based on Conditions
// @namespace    Migrant Workers Centre
// @version      1.4
// @description  Hide specific fields based on conditions and highlight fields based on other field conditions
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @author       Gabriel Dain
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Hide-and-Highlight-Fields.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Hide-and-Highlight-Fields.user.js
// ==/UserScript==

(function() {
    'use strict';

    const hideFieldNames = [
        "Visa_detail",
        "Disadvantage_indicators-only_income_earner",
        "Disadvantage_indicators-has_dependants",
        "Disadvantage_indicators-number_of_dependants",
        "Disadvantage_indicators-financial_hardship",
        "Disadvantage_indicators-unemployed",
        "Disadvantage_indicators-centrelink",
        "Disadvantage_indicators-centrelink_type",
        "Disadvantage_indicators-Homelessness",
        "Disadvantage_indicators-disability_type[]",
        "Disadvantage_indicators-disability",
        "Disadvantage_indicators-family_violence",
        "Disadvantage_indicators-ATSI",
        "Disadvantage_indicators-LGBTQIA",
        "Source_name",
        "Existing_legal_claims_detail",
        "Past_legal_assistance_detail",
        "Past_union_assistance",
        "Past_union_assistance_detail",
    ];

    const highlightConditionsMap = {
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
                    // Ensure the field is shown if the condition is met
                    if (isConditionMet) {
                        fieldToHighlight.closest('tr').style.display = '';
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

    function hideFields() {
        hideFieldNames.forEach(name => {
            const field = document.querySelector(`[name="${name}"]`);
            if (field) {
                const bgColor = window.getComputedStyle(field).backgroundColor;
                const borderColor = window.getComputedStyle(field).borderColor;
                let shouldHide = false;
                let targetRow = field.closest('tr');

                if (field.type === 'checkbox') {
                    shouldHide = !field.checked;
                } else if (field.type === 'select-one' || field.type === 'select-multiple') {
                    if (field.type === 'select-multiple') {
                        shouldHide = !Array.from(field.options).some(option => option.selected && option.value !== "");
                        targetRow = targetRow.closest('table').closest('tr');
                    } else {
                        shouldHide = field.selectedIndex === -1 || field.value === "" || field.value === "(Please select)";
                    }
                } else {
                    shouldHide = !field.value;
                }

                if (shouldHide && bgColor !== 'rgb(218, 237, 207)' && borderColor !== 'rgb(88, 158, 41)') {
                    targetRow.style.display = 'none';
                }
            }
        });
    }

    function showAllFields() {
        hideFieldNames.forEach(name => {
            const field = document.querySelector(`[name="${name}"]`);
            if (field) {
                let targetRow = field.closest('tr');
                targetRow.style.display = '';
                if (field.type === 'select-multiple') {
                    targetRow.closest('table').closest('tr').style.display = '';
                }
            }
        });
    }

    function showFieldsIfConditionsMet() {
        hideFieldNames.forEach(name => {
            const field = document.querySelector(`[name="${name}"]`);
            if (field) {
                let shouldShow = false;
                let targetRow = field.closest('tr');

                if (field.type === 'checkbox') {
                    shouldShow = field.checked;
                } else if (field.type === 'select-one' || field.type === 'select-multiple') {
                    if (field.type === 'select-multiple') {
                        shouldShow = Array.from(field.options).some(option => option.selected && option.value !== "");
                        targetRow = targetRow.closest('table').closest('tr');
                    } else {
                        shouldShow = field.selectedIndex !== -1 && field.value !== "" && field.value !== "(Please select)";
                    }
                } else {
                    shouldShow = !!field.value;
                }

                if (shouldShow) {
                    targetRow.style.display = '';
                }
            }
        });
    }

    function initHighlighting() {
        for (const fieldId in highlightConditionsMap) {
            const { targetIds, conditions, message } = highlightConditionsMap[fieldId];
            checkFieldAndHighlight(fieldId, targetIds, conditions, message);
        }

        for (const fieldId in highlightConditionsMap) {
            const { targetIds, conditions, message } = highlightConditionsMap[fieldId];
            const field = document.getElementById(fieldId);

            if (field) {
                field.addEventListener('change', () => {
                    checkFieldAndHighlight(fieldId, targetIds, conditions, message);
                    showFieldsIfConditionsMet();
                });
                if (field.type === 'text' || field.type === 'textarea') {
                    field.addEventListener('input', () => {
                        checkFieldAndHighlight(fieldId, targetIds, conditions, message);
                        showFieldsIfConditionsMet();
                    });
                }
            }

            targetIds.forEach(targetId => {
                const fieldToHighlight = document.getElementById(targetId);
                if (fieldToHighlight) {
                    fieldToHighlight.addEventListener('input', () => {
                        checkFieldAndHighlight(fieldId, targetIds, conditions, message);
                        showFieldsIfConditionsMet();
                    });
                    fieldToHighlight.addEventListener('change', () => {
                        checkFieldAndHighlight(fieldId, targetIds, conditions, message);
                        showFieldsIfConditionsMet();
                    });
                }
            });
        }
    }

    // Create and add buttons
    const form = document.querySelector('#formDataCollection');
    if (form) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '20px';

        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Show all';
        showAllButton.type = 'button';
        showAllButton.onclick = showAllFields;

        const hideEmptyButton = document.createElement('button');
        hideEmptyButton.textContent = 'Hide empty';
        hideEmptyButton.type = 'button';
        hideEmptyButton.style.marginLeft = '10px';
        hideEmptyButton.onclick = hideFields;

        buttonContainer.appendChild(showAllButton);
        buttonContainer.appendChild(hideEmptyButton);
        form.insertBefore(buttonContainer, form.firstChild);
    }

    // Initial call to show fields if conditions are met
    showFieldsIfConditionsMet();

    // Initial call to highlight fields based on conditions
    initHighlighting();
})();
