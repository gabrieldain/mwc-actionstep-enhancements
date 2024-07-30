// ==UserScript==
// @name         Collapse/Expand All
// @description  Adds Collapse All/Expand All buttons to toggle list item classes
// @namespace    Migrant Workers Centre
// @match        *https://ap-southeast-2.actionstep.com/mym/asfw/workflow/action/overview/action_id/*
// @grant        none
// @version      0.3
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Collapse-Expand-All.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Collapse-Expand-All.user.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to toggle the class of all list items
  function toggleListItems(collapse) {
    const listItems = document.querySelectorAll('.SortableList li');
    listItems.forEach(item => {
      item.classList.toggle('Open', !collapse);
      item.classList.toggle('Minimized', collapse);
    });
  }

  // Create the buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.flexDirection = 'column';
  buttonsContainer.style.gap = '5px';
  buttonsContainer.style.position = 'absolute';
  buttonsContainer.style.top = '10px';
  buttonsContainer.style.right = '10px';
  buttonsContainer.style.zIndex = '999';

  const collapseAllButton = document.createElement('button');
  collapseAllButton.textContent = 'Collapse All';
  collapseAllButton.style.backgroundColor = '#74aa50';
  collapseAllButton.style.color = 'white';
  collapseAllButton.style.padding = '8px 15px';
  collapseAllButton.style.borderRadius = '5px';
  collapseAllButton.style.border = 'none';
  collapseAllButton.addEventListener('mouseover', () => {
    collapseAllButton.style.backgroundColor = '#589e29';
  });
  collapseAllButton.addEventListener('mouseout', () => {
    collapseAllButton.style.backgroundColor = '#74aa50';
  });
  collapseAllButton.addEventListener('click', () => toggleListItems(true));

  const expandAllButton = document.createElement('button');
  expandAllButton.textContent = 'Expand All';
  expandAllButton.style.backgroundColor = '#74aa50';
  expandAllButton.style.color = 'white';
  expandAllButton.style.padding = '8px 15px';
  expandAllButton.style.borderRadius = '5px';
  expandAllButton.style.border = 'none';
  expandAllButton.addEventListener('mouseover', () => {
    expandAllButton.style.backgroundColor = '#589e29';
  });
  expandAllButton.addEventListener('mouseout', () => {
    expandAllButton.style.backgroundColor = '#74aa50';
  });
  expandAllButton.addEventListener('click', () => toggleListItems(false));

  buttonsContainer.appendChild(collapseAllButton);
  buttonsContainer.appendChild(expandAllButton);

  // Insert the buttons at the top of the global content wrapper
  const globalContentWrapper = document.getElementById('global-content-wrapper');
  globalContentWrapper.insertBefore(buttonsContainer, globalContentWrapper.firstChild);
})();
