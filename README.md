# MWC Actionstep Enhancements suite

This repository contains UserScripts designed to enhance the functionality and user experience of the Actionstep platform at the Migrant Workers Centre. Each script provides specific features to improve efficiency and usability. Below are detailed descriptions and usage instructions for each script.

## Table of Contents
- [Autofill File Note Template](#autofill-file-note-template)
- [Highlight Text Based on Field Conditions](#highlight-text-based-on-field-conditions)
- [Matter Page Enhancements](#matter-page-enhancements)
- [Multi-Select Resizer](#multi-select-resizer)

## Autofill File Note Template

### Description
This script adds custom fields to the file note editor based on the MWC file note template.

### Features
- Adds dropdown controls for start time, finish time, participants, mode of service delivery, and interpreter details.
- Appends entered data to the file note text area.
- Replaces the default save button with a custom button that appends the data and submits the form.

### Configuration & usage
1. Navigate to the file note section in Actionstep.
2. Use the provided dropdowns and fields to enter relevant details.
3. Click the custom "Save and Submit" button to append the details to the file note and submit the form.

### Configuration
To edit the fields available, modify the `dropdownHtml` string within the script.

## Hide and Highlight Fields based on Conditions

### Description
This script hides specific fields based on conditions and highlights fields in the 'Intake data' editing page based on the content of other fields, to support intake interactions with prospective clients.

### Features
- Hides fields when certain conditions are not met (activated by clicking "Hide empty").
- Highlights fields when certain conditions are met (e.g., when a checkbox is checked or a specific option is selected).
- Displays custom messages next to highlighted fields.
- Automatically shows fields when conditions are met.

### Usage
1. Navigate to a matter's 'Intake data' editing page.
2. Click the "Hide empty" button to hide fields that do not meet conditions.
3. Fields will automatically highlight and show based on predefined conditions.

### Configuration
To edit the conditions and fields affected, modify the `hideFieldNames` array and `highlightConditionsMap` object within the script.

#### Example Configurations:
##### Hiding Fields
Specify fields to be hidden. These fields will be hidden when they are empty and not being highlighted.
```javascript
const hideFieldNames = [
    "Visa_detail",
    "Source_name",
    // add other field names here
];
```
##### Highlighting fields
  ```javascript
  const highlightConditionsMap = {
    'Visa': {
      targetIds: ['Visa_detail'],
      conditions: ['*bridging*', '*other*'], // multiple conditions
      message: 'Ask about substantive visa', // message
    },
  'Disadvantage_indicators-disability': {
    targetIds: ['Disadvantage_indicators-disability_type'],
    conditions: ['!checked'], // negative condition
    message: ''
  },
  'Employer_status': {
    targetIds: ['Termination-manner', 'Last_day_of_work_description'], // multiple targetIds
    conditions: ['*not still employed*'], // wildcard condition
    message: '',
  },
    // add other conditions here
  };
  ```
##### Condition types
- Positive Conditions: Specify conditions that must be met for fields to be highlighted and shown.
- Negative Conditions: Prefix the condition with `!` to highlight fields when the specified condition is not met.
- Wildcard Conditions: Use `*` as a wildcard in conditions to match any text.
- Multiple Conditions: Specify multiple conditions by listing them in the `conditions` array. The field will highlight if any of the conditions are met.
- Multiple Targets: Specify multiple target fields by listing them in the `targetIds` array.

## Matter Page Enhancements

### Description
This script enhances the matter home page on Actionstep with various features.

### Features
- Hides unnecessary menu items (configurable).
- Adds labels below menu items.
- Provides expand/collapse all toggle buttons for list items.
- Highlights expired limitation dates.
- Highlights conflict status.
- Prints relevant contact info on the matter page.

### Usage
1. Install the script in your UserScript manager.
2. Navigate to a matter page in Actionstep.
3. Use the provided buttons and observe the enhancements.

### Configuration
To edit which menu items are hidden or labelled, modify the `config` object within the script by setting each key to `true` to hide the item or `false` to display it with a label.

## Multi-Select Resizer

### Description
This script adds drag-and-drop resize functionality to multi-select elements and doubles their default height in Actionstep.

### Features
- Allows multi-select elements to be resized via a draggable corner.
- Doubles the default height of multi-select elements to improve readability.

### Usage
1. Navigate to a form with multi-select elements in Actionstep.
2. Drag the corner of a multi-select element to resize it.

### License
This work is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
