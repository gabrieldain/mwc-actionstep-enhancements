// ==UserScript==
// @name         Create Outlook Event from Page Data
// @description  Collect data and create an Outlook Online event
// @namespace    Migrant Workers Centre
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @version      0.92
// @author       Gabriel Dain
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Create-Outlook-Event-from-Page-Data.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Create-Outlook-Event-from-Page-Data.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Initial console log to confirm the script is running

    // Function to extract Matter ID from the URL query parameters
    function convertDateFormat(dateString) {
        const months = {
            "January": "01",
            "February": "02",
            "March": "03",
            "April": "04",
            "May": "05",
            "June": "06",
            "July": "07",
            "August": "08",
            "September": "09",
            "October": "10",
            "November": "11",
            "December": "12"
        };
        const dateParts = dateString.split(" ");
        const month = months[dateParts[1]];
        const day = dateParts[2].replace(",", "");
        const year = dateParts[3]; 
        return `${year}-${month}-${day}T00%3A00%3A01`;
    }

    // Function to calculate the next day date in the same format
    function calculateNextDay(dateString) {
        const date = new Date(dateString.replace("T00%3A00%3A01", "T00:00:01").replace(/%3A/g, ":"));
        date.setDate(date.getDate() + 1);
        const nextYear = date.getFullYear();
        const nextMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two-digit format
        const nextDay = ("0" + date.getDate()).slice(-2); // Ensure two-digit format
        return `${nextYear}-${nextMonth}-${nextDay}T00%3A00%3A01`.replace(/:/g, "%3A");
    }
    
    function extractMatterIdFromUrl() {
        const url = window.location.href;

        // Use URLSearchParams to extract the action_id from the query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const matterId = urlParams.get('action_id');
        return matterId;
    }

    // Function to create and insert the button immediately
    function createButton() {
        // Locate the 'Type' row to insert the button after it
        const typeSelect = document.querySelector('select[name="Type"]');
        if (!typeSelect) {
            setTimeout(createButton, 500); // Retry after 500ms if typeSelect is not found
            return;
        }
        const typeRow = typeSelect.closest('tr');

        // Create a new row for the button
        const buttonRow = document.createElement('tr');
        buttonRow.className = 'cs-field'; // Corrected class assignment

        const buttonTitleCell = document.createElement('td');
        buttonTitleCell.className = 'cs-field-label'; // Corrected class assignment
        buttonTitleCell.textContent = 'Calendar';

        const buttonCell = document.createElement('td');
        buttonCell.colSpan = 2; // Span across the whole table row
        buttonCell.className = 'cs-field-value'; // Corrected class assignment
        buttonCell.style.textAlign = 'left'; // Left align the button

        // Create the button and apply initial styles
        const button = document.createElement('button');
        button.textContent = 'Create Outlook Event';
        button.style.backgroundColor = 'grey'; // Initially greyed out
        button.style.color = 'white';
        button.style.padding = '8px 15px';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.cursor = 'not-allowed'; // Disabled cursor initially
        button.disabled = true; // Initially disabled

        // Append the button to the buttonCell, and both cells to buttonRow
        buttonCell.appendChild(button);
        buttonRow.appendChild(buttonTitleCell);
        buttonRow.appendChild(buttonCell);

        // Insert the buttonRow after the 'Type' row
        typeRow.parentNode.insertBefore(buttonRow, typeRow.nextSibling);

        return button; // Return the button for further use
    }

    // Function to initialize the script once elements are available
    function initScript(button) {
        const matterId = extractMatterIdFromUrl();

        if (!matterId) {
            return;
        }


        const dateInput = document.querySelector('input.DateControl_DateInputBox[title]');
        const causeOfActionInput = document.querySelector('input[name="Cause_of_action"]');
        const typeSelect = document.querySelector('select[name="Type"]');

        // Log the found elements for debugging

        // Check if elements are found
        if (!dateInput || !causeOfActionInput || !typeSelect) {
            return;
        }

        // Function to check if all inputs have valid data and enable the button
        function updateButtonState() {
            const dateValue = dateInput.title; // Extract date from title attribute
            const causeOfActionValue = causeOfActionInput.value;
            const typeValue = typeSelect.options[typeSelect.selectedIndex].value;

            // Log the values being checked

            if (!dateValue || !causeOfActionValue || !typeValue || !matterId) {
                // If any field is missing, keep the button disabled
                button.disabled = true;
                button.style.backgroundColor = 'grey';
                button.style.cursor = 'not-allowed'; // Disabled cursor
                button.onclick = null;
                return;
            }

            // Determine the subject based on the type
            let subject;
            if (typeValue === "Limitation date") {
                subject = `[${matterId}] - Limitation Date - ${causeOfActionValue}`;
            } else if (typeValue === "Other critical date (e.g. disciplinary meeting)") {
                subject = `[${matterId}] - Critical Date - ${causeOfActionValue}`;
            } else {
                subject = `[${matterId}] - Event - ${causeOfActionValue}`;
            }

            // Generate the Outlook Online new event URL
            const encodedSubject = encodeURIComponent(subject);
            const startdt = convertDateFormat(dateValue);
            console.log(startdt);
            const enddt = calculateNextDay(startdt);
            console.log(enddt);
            const outlookUrl = `https://outlook.office.com/calendar/legal@migrantworkers.org.au/deeplink/compose?subject=${encodedSubject}&startdt=${startdt}&enddt=${enddt}&allday=true`;

            // Enable the button and set the onclick event
            button.disabled = false;
            button.style.backgroundColor = 'rgb(116, 170, 80)'; // Green background when enabled
            button.style.cursor = 'pointer'; // Pointer cursor when enabled
            button.onclick = (event) => {
                event.preventDefault(); // Prevent the default form submission
                window.open(outlookUrl, '_blank');
            };
        }

        // Add event listeners to the inputs to check for changes
        dateInput.addEventListener('input', updateButtonState);
        causeOfActionInput.addEventListener('input', updateButtonState);
        typeSelect.addEventListener('change', updateButtonState);

        // Initial check to set the button state correctly
        updateButtonState();
    }

    // Function to observe DOM changes for required elements
    function observeDOMChanges(button) {

        const observer = new MutationObserver((mutations, obs) => {
            // Check if all elements are available
            const dateInput = document.querySelector('input.DateControl_DateInputBox[title]');
            const causeOfActionInput = document.querySelector('input[name="Cause_of_action"]');
            const typeSelect = document.querySelector('select[name="Type"]');

            // If all elements are found and remain stable, initialize the script
            if (dateInput && causeOfActionInput && typeSelect) {
                obs.disconnect(); // Stop observing once elements are found
                initScript(button); // Initialize the script with the button
            } else {
            }
        });

        // Start observing the document
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Create the button immediately
    const button = createButton();

    // Start observing DOM changes with the button
    if (button) {
        observeDOMChanges(button);
    }

})();

