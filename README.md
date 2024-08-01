# MWC ActionStep Enhancements suite

This repository contains UserScripts designed to enhance the functionality and user experience of the ActionStep platform at the Migrant Workers Centre. Each script provides specific features to improve efficiency and usability. Below are detailed descriptions and usage instructions for each script.

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
1. Navigate to the file note section in ActionStep.
2. Use the provided dropdowns and fields to enter relevant details.
3. Click the custom "Save and Submit" button to append the details to the file note and submit the form.

### Configuration
To edit the fields available, modify the `dropdownHtml` string within the script.

## Highlight Text Based on Field Conditions

### Description
This script highlights specific fields in the 'Intake data' editing page based on the content of other fields, to support intake interactions with prospective clients.

### Features
- Highlights fields when certain conditions are met (e.g., when a checkbox is checked or a specific option is selected).
- Displays custom messages next to highlighted fields.

### Usage
1. Navigate to a matter's 'Intake data" editing page.
2. Fields will automatically highlight based on predefined conditions.

### Configuration
To edit the conditions and target fields:
1. Modify the `fieldMap` object within the script.
2. Each entry in `fieldMap` specifies the field to watch, the conditions, and the target fields to highlight.

#### FieldMap entries
##### Multiple Target Fields:
You can specify multiple fields to be highlighted by listing their IDs in the `targetIds` array.
  ```javascript
  'Source': {
      targetIds: ['Source_name', 'Source_details'],
      conditions: ['I was referred by another organisation'],
      message: 'Please specify the organisation that provided the referral and provide contact details.'
  },
  ```
##### Multiple Conditions
You can specify multiple conditions by listing them in the `conditions` array. The field will highlight if any of the conditions are met.
  ```javascript
  'Employer_status': {
      targetIds: ['Termination-manner'],
      conditions: ['I am not still employed by the employer and want advice about the end of my employment', 'I am on leave'],
      message: ''
  },
  ```
##### Negative Conditions
To specify a negative condition, prefix the condition with `!`. This will highlight the target fields when the specified condition is *not* met.
  ```javascript
  'Disadvantage_indicators-disability': {
      targetIds: ['Disadvantage_indicators-disability_type'],
      conditions: ['!checked'],
      message: ''
  },
  ```
##### Wildcard Conditions
Use `*` as a wildcard in conditions to match any text.
  ```javascript
  'Issue_type': {
      targetIds: ['Injury-reported_to_employer', 'Injury-doctor_or_health_professional', 'Injury-certificate_of_capacity'],
      conditions: ['I was injured*'],
      message: ''
  },
  ```

## Matter Page Enhancements

### Description
This script enhances the matter home page on ActionStep with various features.

### Features
- Hides unnecessary menu items (configurable).
- Adds labels below menu items.
- Provides expand/collapse all toggle buttons for list items.
- Highlights expired limitation dates.
- Prints relevant contact info on the matter page.

### Usage
1. Install the script in your UserScript manager.
2. Navigate to a matter page in ActionStep.
3. Use the provided buttons and observe the enhancements.

### Configuration
To edit which menu items are hidden or labelled, modify the `config` object within the script by setting each key to `true` to hide the item or `false` to display it with a label.

## Multi-Select Resizer

### Description
This script adds drag-and-drop resize functionality to multi-select elements and doubles their default height in ActionStep.

### Features
- Allows multi-select elements to be resized via a draggable corner.
- Doubles the default height of multi-select elements to improve readability.

### Usage
1. Navigate to a form with multi-select elements in ActionStep.
2. Drag the corner of a multi-select element to resize it.
