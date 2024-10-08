// ==UserScript==
// @name         Multi-Select Resizer
// @description  Add drag & drop resize functionality to multi-select elements and double their default height
// @namespace    Migrant Workers Centre
// @match        *ap-southeast-2.actionstep.com/*
// @grant        none
// @version      0.32
// @author       Gabriel Dain <gdain@migrantworkers.org.au>
// @downloadURL  https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Multi-Select-Resizer.user.js
// @updateURL    https://github.com/gabrieldain/mwc-actionstep-enhancements/raw/main/Multi-Select-Resizer.user.js
// ==/UserScript==

(function() {
    'use strict';

    function makeResizable(element) {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        resizer.style.width = '10px';
        resizer.style.height = '10px';
        resizer.style.background = 'gray';
        resizer.style.position = 'absolute';
        resizer.style.right = '0';
        resizer.style.bottom = '0';
        resizer.style.cursor = 'se-resize';

        element.style.position = 'relative';
        element.style.resize = 'both';
        element.style.overflow = 'auto';
        element.appendChild(resizer);

        resizer.addEventListener('mousedown', initResize, false);

        function initResize(e) {
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }

        function Resize(e) {
            const newWidth = e.clientX - element.getBoundingClientRect().left;
            const newHeight = e.clientY - element.getBoundingClientRect().top;

            if (newWidth > 0) element.style.width = newWidth + 'px';
            if (newHeight > 0) element.style.height = newHeight + 'px';
        }

        function stopResize(e) {
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
        }

        function adjustHeight(selectElement) {
            const optionCount = selectElement.options.length;
            const optionHeight = selectElement.options[0].offsetHeight; // Assuming consistent option height
            const maxHeight = optionHeight * 9; // Maximum height for 9 options
            const calculatedHeight = Math.min(optionCount * optionHeight, maxHeight) + 6;
            selectElement.style.height = calculatedHeight + 'px';
        }

        // Initial height adjustment
        adjustHeight(element);
        // Event listener for dynamic adjustments (optional)
        element.addEventListener('change', () => {
            adjustHeight(element);
        });
    }

    // Find all multi-select elements, double their default height, and make them resizable
    const multiSelects = document.querySelectorAll('select[multiple]');
    multiSelects.forEach(element => {
        makeResizable(element);
    });
})();
