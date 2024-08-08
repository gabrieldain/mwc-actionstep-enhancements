// ==UserScript==
// @name         Autofill File Note Template
// @description  "Adds dropdown fields and a custom save button to append data and submit the file note field on ActionStep."
// @namespace    Migrant Workers Centre
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @version      0.94a
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Autofill-File-Note-Template.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Autofill-File-Note-Template.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Target textarea and button properties
    const textareaId = 'note_text';
    const saveButtonId = 'saveButton';

    // HTML for the dropdown fields and custom button
const dropdownHtml = `
<div id="fileNoteControls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; gap: 10px;">
        <label for="start_time" style="font-weight: bold; font-size: 0.9em;">Start:</label>
        <input type="text" id="start_time" placeholder="HH:MM" style="width: 70px;">
        <label for="finish_time" style="font-weight: bold; font-size: 0.9em;">Finish:</label>
        <input type="text" id="finish_time" placeholder="HH:MM" style="width: 70px;">
    </div>

    <div>
        <label for="participants" style="font-weight: bold; font-size: 0.9em;">Participants:</label>
        <input type="text" id="participants" placeholder="Enter participants' names" style="width: 100%;">
    </div>

    <div>
        <label for="interpreter" style="font-weight: bold; font-size: 0.9em;">Interpreter/translator used:</label>
        <select id="interpreter" style="width: 100%; height: calc(1.5em + 10px); border-radius: 5px; border: 1px solid #d1d1d1; color: #8395a0;">
            <option value=""></option>
            <option value="No, not required">No, not required</option>
            <option value="No, required but unavailable">No, required but unavailable</option>
            <option value="Yes, NAATI accredited">Yes, NAATI accredited</option>
            <option value="Yes, NAATI recognised">Yes, NAATI recognised</option>
            <option value="Yes, MWC staff">Yes, MWC staff</option>
            <option value="Yes, a friend or family member of the client">Yes, a friend or family member of the client</option>
            <option value="Yes, technological solution">Yes, technological solution</option>
            <option value="Yes, other">Yes, other</option>
        </select>
    </div>

    <div>
        <label for="service_mode" style="font-weight: bold; font-size: 0.9em;">Mode of service delivery:</label>
        <select id="service_mode" style="width: 100%; height: calc(1.5em + 10px); border-radius: 5px; border: 1px solid #d1d1d1; color: #8395a0;">
            <option value=""></option>
            <option value="Phone in">Phone in</option>
            <option value="Phone out">Phone out</option>
            <option value="Face-to-face">Face-to-face</option>
            <option value="Video conference">Video conference</option>
            <option value="Email">Email</option>
            <option value="Other">Other</option>
        </select>
    </div>

    <div>
        <label for="interpreter_name" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Interpreter name:</label>
        <input type="text" id="interpreter_name" placeholder="Enter interpreter's name, if one was used" style="width: 100%;">
    </div>
    <div>
        <label for="spacer" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;"></label>
    </div>
    <div>
        <label for="file_note" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 0px;">File note:</label>
    </div>
</div>
`;

    // Function to insert dropdown HTML and replace the save button
    function setupControls() {
        const textarea = document.getElementById(textareaId);
        const saveButton = document.getElementById(saveButtonId);

        if (textarea && !document.getElementById('fileNoteControls')) {
            // Insert dropdown controls above the textarea
            const container = document.createElement('div');
            container.innerHTML = dropdownHtml;
            textarea.parentNode.insertBefore(container, textarea);

            // Replace the built-in save button with a custom button
            if (saveButton) {
                const saveButtonContainer = saveButton.parentElement;
                saveButton.style.display = 'none'; // Hide the original save button

                const customButton = document.createElement('button');
                customButton.id = 'customSaveButton';
                customButton.textContent = 'Save and Submit';
                customButton.className = 'as-button as-button--primary'; // Match the styling of the original save button

                // Insert the new button in the same place as the original save button
                saveButtonContainer.insertBefore(customButton, saveButton.nextSibling);

                customButton.addEventListener('click', handleSaveAndSubmit);
            }
        }
    }

    // Function to append fields to the textarea and submit the form
    function handleSaveAndSubmit(event) {
        event.preventDefault(); // Prevents default button behaviour

        const startTime = document.getElementById('start_time').value;
        const finishTime = document.getElementById('finish_time').value;
        const participants = document.getElementById('participants').value;
        const serviceMode = document.getElementById('service_mode').value;
        const interpreter = document.getElementById('interpreter').value;
        const interpreterName = document.getElementById('interpreter_name').value;

        let noteContent = ``;
        if (startTime || finishTime || participants || serviceMode || interpreter || interpreterName) {
            noteContent = `\n__________________________________________`;
        }
        if (startTime) {
            noteContent += `\nStart time: ${startTime}`;
        }
        if (finishTime) {
            noteContent += `\nFinish time: ${finishTime}`;
        }
        if (participants) {
            noteContent += `\nParticipants: ${participants}`;
        }
        if (serviceMode) {
            noteContent += `\nMode of service delivery: ${serviceMode}`;
        }
        if (interpreter) {
            noteContent += `\nInterpreter/translator used: ${interpreter}`;
        }
        if (interpreterName) {
            noteContent += `\nInterpreter name: ${interpreterName}`;
        }

        const textarea = document.getElementById(textareaId);
        if (textarea) {
            textarea.value += noteContent; // Append to existing text
        }

        // Try to find the correct form using the specific class
        const form = document.querySelector('form.as-form');
        console.log('Form:', form); // Log the form element for debugging

        if (form) {
            // Create and dispatch a submit event programmatically
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            form.dispatchEvent(submitEvent);

            // Check if default action is prevented
            if (!submitEvent.defaultPrevented) {
                form.submit(); // Submit the form if not cancelled
            }
        } else {
            console.error('Form not found');
        }
    }

    // Observe changes in the DOM for new elements
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                setupControls();
                break; // Stop after first change, as we only need to add controls once
            }
        }
    });

    // Configure observer to watch for the addition of the target textarea
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check for the textarea on page load
    setupControls();
})();
