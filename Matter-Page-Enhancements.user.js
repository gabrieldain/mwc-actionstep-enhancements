// ==UserScript==
// @name         Matter Page Enhancements
// @description  Enhances Actionstep matter pages with various features
// @namespace    Migrant Workers Centre
// @match        *ap-southeast-2.actionstep.com/mym/asfw/workflow/action*
// @grant        none
// @version      0.31
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Matter-Page-Enhancements.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Matter-Page-Enhancements.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for hiding menu items
    const config = {
        home: false,
        parties: false,
        steps: false,
        notes: false,
        appointments: false,
        tasks: false,
        comms: false,
        alerts: true,
        view: true,
        documents: false,
        reports: true,
        billing: true,
        trustAccounting: true,
        wiki: true,
        portal: false
    };

    const menuItems = {
        home: '.cs-navigation-bar-item--home',
        parties: '.cs-navigation-bar-item--parties',
        steps: '.cs-navigation-bar-item--steps',
        notes: '.cs-navigation-bar-item--file-notes',
        appointments: '.cs-navigation-bar-item--appointments',
        tasks: '.cs-navigation-bar-item--tasks',
        comms: '.cs-navigation-bar-item--comms',
        alerts: '.cs-navigation-bar-item--alerts',
        view: '.cs-navigation-bar-item--view',
        documents: '.cs-navigation-bar-item--documents',
        reports: '.cs-navigation-bar-item--reports',
        billing: '.cs-navigation-bar-item--billing',
        trustAccounting: '.cs-navigation-bar-item--trust-accounting',
        wiki: '.cs-navigation-bar-item--wiki',
        portal: '.cs-navigation-bar-item--portal'
    };

    // Function to hide menu items and add labels
    function processMenuItems() {
        const subNavWrapper = document.querySelector('.SubNavigationWrapper');
        if (!subNavWrapper) return;

        for (const [key, selector] of Object.entries(menuItems)) {
            const elements = subNavWrapper.querySelectorAll(selector);
            elements.forEach(element => {
                if (config[key]) {
                    element.style.display = 'none';
                } else {
                    addLabel(element, key);
                }
            });
        }
    }

    // Function to add label below the button
    function addLabel(element, key) {
        if (!element.querySelector('.menu-label')) {
            const label = document.createElement('div');
            label.className = 'menu-label';
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            label.style.cssText = `
                font-size: 10px;
                text-align: center;
                margin-top: 2px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            `;

            element.style.display = 'flex';
            element.style.flexDirection = 'column';
            element.style.alignItems = 'center';
            element.style.padding = '0 5px';

            const iconElement = element.querySelector('a');
            if (iconElement) {
                iconElement.style.marginBottom = '2px';
            }

            element.appendChild(label);
        }
    }

    // Function to toggle the class of all list items
    function toggleListItems(collapse) {
        const listItems = document.querySelectorAll('.SortableList li');
        listItems.forEach(item => {
            item.classList.toggle('Open', !collapse);
            item.classList.toggle('Minimized', collapse);
            const actionPanel = item.querySelector('.cs-action-panel__body.js-action-panel__body');
            if (actionPanel) {
                actionPanel.style.display = collapse ? 'none' : 'block';
            }
        });
    }

    // Create the Collapse/Expand buttons
    function createCollapseExpandButtons() {
        if (!window.location.href.match(/\/mym\/asfw\/workflow\/action\/overview\/action_id\//)) {
            return; // Exit if not on the correct page
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 999;
        `;

        const buttonStyle = `
            background-color: #74aa50;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
        `;

        const collapseAllButton = document.createElement('button');
        collapseAllButton.textContent = 'Collapse All';
        collapseAllButton.style.cssText = buttonStyle;
        collapseAllButton.addEventListener('mouseover', () => collapseAllButton.style.backgroundColor = '#589e29');
        collapseAllButton.addEventListener('mouseout', () => collapseAllButton.style.backgroundColor = '#74aa50');
        collapseAllButton.addEventListener('click', () => toggleListItems(true));

        const expandAllButton = document.createElement('button');
        expandAllButton.textContent = 'Expand All';
        expandAllButton.style.cssText = buttonStyle;
        expandAllButton.addEventListener('mouseover', () => expandAllButton.style.backgroundColor = '#589e29');
        expandAllButton.addEventListener('mouseout', () => expandAllButton.style.backgroundColor = '#74aa50');
        expandAllButton.addEventListener('click', () => toggleListItems(false));

        buttonsContainer.appendChild(collapseAllButton);
        buttonsContainer.appendChild(expandAllButton);

        const globalContentWrapper = document.getElementById('global-content-wrapper');
        if (globalContentWrapper) {
            globalContentWrapper.insertBefore(buttonsContainer, globalContentWrapper.firstChild);
        }
    }

    // Run processMenuItems function multiple times
    function runMultipleTimes(times = 5) {
        for (let i = 0; i < times; i++) {
            setTimeout(processMenuItems, i * 1000);
        }
    }

    function formatPastDates() {
        const dateContainers = document.querySelectorAll('.Row');
        dateContainers.forEach(container => {
            const dt = container.querySelector('dt');
            const dd = container.querySelector('dd');
            if (dt && dd && dt.textContent.trim() === 'Date:') {
                const dateText = dd.textContent;
                const dateMatch = dateText.match(/(\w+\s+\w+\s+\d+,\s+\d{4})/);
                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    const date = new Date(dateStr);
                    const now = new Date();
                    if (date < now) {
                        const newContent = dd.innerHTML.replace(dateStr, `<span style="font-weight: bold; color: red;">${dateStr} [EXPIRED]</span>`);
                        dd.innerHTML = newContent;
                    }
                }
            }
        });
    }

    // Run the functions when the page is loaded
    window.addEventListener('load', () => {
        runMultipleTimes();
        createCollapseExpandButtons();
        formatPastDates();
    });

    // Also run immediately in case the page has already loaded
    runMultipleTimes();
    createCollapseExpandButtons();

    // Add formatPastDates to the MutationObserver callback
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                processMenuItems();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();
