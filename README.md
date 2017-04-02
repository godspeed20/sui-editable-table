# sui-editable-table
Multi-row editable table using semantic-ui with redux

After my foray into the Material-UI world, we decided to scrap material ui due to the pain of its inconsistent implementation and missing functionality, and instead switched to a more basic but extendable semantic-ui, which I highly recommend.

As such, I ported the mui-editable-table over. It's pretty much identical, just using the sui components.

I've also left in all the build/demo run code which I used from windows so hopefully other people won't have the same issues I did trying to get the bundling working for a new component.

<img src="https://raw.githubusercontent.com/godspeed20/sui-editable-table/master/example.png">

## Install

```javascript
npm install sui-editable-table --save
```

## Usage

Once installed, reference it and pass it the relevant fields. Take a look at the demo under the example folder, or for a quick read continue below or look at example/src/app/Demo.js. 

First include it

```javascript
import SuiEditableTable from "sui-editable-table";
```

Then in your code include it within a form like so

```javascript
<SuiEditableTable
    colSpec={this.colSpec}
    rowData={this.rowData}
    onChange={onChange}
    reorderable={true}
/>
```
* colSpec - see below, config for each column
* rowData - array of records that can be mapped (partially or fully) to the colSpec
* onChange - event to trigger when any changes to the editable table occur, will receive entire data structure back each time
* reorderable (optional) - if set to true, allows rows to be reordered on the table via the up/down arrows

The colSpec would look something like this:
```javascript
const colSpec = [
    {title: 'Title', fieldName: 'title', inputType: "SelectField", selectOptions: ["Mr", "Mrs", "Miss", "Other"], width: 200, defaultValue: 'Mr'},
    {title: 'Name', fieldName: 'foreName', inputType: "TextField", width: 200},
    {title: 'Surname', fieldName: 'surname', inputType: "TextField", width: 200},
    {title: 'Maiden Name', fieldName: 'maidenName', inputType: "TextField", width: 200, isReadOnly: shouldBeReadOnly}
];
```
* Title - the header column value
* fieldName - the value from the rowData object that matches this column and will be used for its data
* inputType - field type to render. Supported types: TextField, SelectField
* width - how wide your want the column to be
* defaultValue (optional) - should you wish to default your field, say for a number field you might want to default to 0.0, or a country field to your default country, etc
* selectOptions (SelectField only) - list of options for your select dropdown. Note it can be a list of strings, or a list of key->value pairs. For the latter you'll need to set them up like [{key: 'keyValue', value: 'displayValue'}]
* isReadOnly (optional) - function to check if field should be read only for the given row

The rowData for the above colSpec could look something like this:
```javascript
const rowData = [
    { title: 'Mr', foreName: 'John', surname: 'Smith'},
    { title: 'Miss', foreName: 'Emily', surname: 'Lockhart'},
    { title: 'Mrs', foreName: 'Marilyn', surname: 'Monroe'}
];
```

the onChange event would then give you the entire dataset back. you can log it or store it locally to use on the forms submit method:
```javascript
const onChange = (dataTable) => {
    console.log(dataTable)
};
```
