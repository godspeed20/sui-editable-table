import React from "react";
import {Popup, Button, Input, Dropdown} from "semantic-ui-react";
import $ from "jquery";

class SuiEditableTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            colSpec: [],
            reorderable: false,
            onChange: function () {
            }
        };

        this.onSemanticFieldChange = this.onSemanticFieldChange.bind(this);
        this.onAddRow = this.onAddRow.bind(this);
        this.onDeleteRow = this.onDeleteRow.bind(this);
        this.onReorderRow = this.onReorderRow.bind(this);
    }

    componentDidMount() {
        this.setState(
            {
                rowData: $.extend(true, [], this.props.rowData),
                colSpec: this.props.colSpec,
                reorderable: this.props.reorderable || false,
                onChange: this.props.onChange
            }
        );
    }

    render() {
        const editableTableStyle = {
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Roboto, sans-serif",
        };

        return (
            <div className="container">
                <div className="sui-editable-table" style={editableTableStyle}>
                    {this.renderHeader()}

                    {this.state.rowData.map((dataRow, i) => (
                        this.renderRow(dataRow, i)
                    ))}
                    <input
                        type="hidden"
                        id="sui-editable-table-count"
                        ref="sui-editable-table-count"
                        value={this.state.rowData.length}
                        readOnly="readOnly"
                    />
                </div>
            </div>
        )
    }

    renderHeader() {
        const headerRowStyle = {
            width: "100%",
            display: "flex",
            flexFlow: "row nowrap",
            border: "0",
            height: "40px",
            color: "rgb(158, 158, 158)",
            fontSize: "12px",
            borderBottom: "1px solid #ccc",
            paddingTop: "10px"
        };

        return (
            <div className="sui-editable-table-row header-row" style={headerRowStyle}>
                {this.state.colSpec.map((col) => (
                    <div
                        className={"row-cell header-cell " + col.fieldName}
                        key={col.fieldName}
                        style={{width: col.width}}
                    >
                        {col.title}
                    </div>
                ))}
                <div className={"row-cell header-cell action"} style={{width: "100px"}}>
                    {this.iconButton('', 'add', this.onAddRow(), <AddIcon />)}
                </div>
            </div>
        )
    }

    renderRow(dataRow, index) {
        const dataRowStyle = {
            width: "100%",
            display: "flex",
            flexFlow: "row nowrap",
            border: "0",
            height: "40px",
            borderBottom: "1px solid rgb(224, 224, 224)"
        };

        return (
            <div className="sui-editable-table-row" key={index} style={dataRowStyle}>
                {this.state.colSpec.map((col) => (
                    <div
                        className={"cell " + col.fieldName}
                        key={col.fieldName + index}
                        style={{width: col.width}}
                    >
                        {this.renderInputField(col, index, dataRow)}
                    </div>
                ))}
                {this.renderRowButtons(index)}
            </div>
        )
    }

    renderInputField(column, index, rowData) {
        if (column.isReadOnly && column.isReadOnly(rowData)) {
            return (<div style={{width: column.width}}></div>)
        }

        if (column.inputType === "TextField") {
            return (
                <Input
                    id={column.fieldName + index}
                    style={{width: column.width}}
                    defaultValue={column.fieldName in rowData ? rowData[column.fieldName] : ''}
                    placeholder={column.title}
                    onChange={this.onSemanticFieldChange(index, column.fieldName)}
                />
            )
        } else if (column.inputType === "SelectField") {
            return (
                <Dropdown
                    id={column.fieldName + index}
                    placeholder={column.title}
                    defaultValue={column.fieldName in rowData ? rowData[column.fieldName] : ''}
                    fluid={true}
                    selection={true}
                    onChange={this.onSemanticFieldChange(index, column.fieldName)}
                    options={column.selectOptions.map((option) => (
                        this.createSelectOption(option)
                    ))}
                />
            )
        }
        throw new Error("Input field type " + column.inputType + " not supported");
    }

    createSelectOption(option) {
        const key = option.key ? option.key : option;
        const value = option.value ? option.value : option;

        return ({key: key, value: value, text: value});
    }

    renderRowButtons(index) {
        let buttons = [
            this.iconButton(index, 'delete', this.onDeleteRow(index), "remove", "Remove Row")
        ];

        if (this.state.reorderable) {
            if (index < (this.state.rowData.length - 1) && this.state.rowData.length > 1) {
                buttons.push(
                    this.iconButton(index, 'demote', this.onReorderRow(index, +1), "arrow down", "Demote row")
                )
            }
            if (index > 0) {
                buttons.push(
                    this.iconButton(index, 'promote', this.onReorderRow(index, -1), "arrow up", "Promote row")
                )
            }
        }

        return (
            <div style={{marginTop: "5px"}}>
                {buttons}
            </div>
        )
    }

    iconButton(rowKey, action, clickEvent, suiIcon, helpText) {
        return (
            <div className="cell action" key={"action" + action + rowKey}>
                <Popup
                    trigger={
                        <Button
                            className={"action-button " + action + "-row-button" + rowKey + " sui-editable-table-button"}
                            basic={true}
                            compact={true}
                            onClick={clickEvent}
                            icon={suiIcon}
                        />
                    }
                    content={helpText}
                    position="top center"
                />
            </div>
        )
    }

    onAddRow() {
        const self = this;
        return function () {
            let tempDataRow = $.extend(true, [], self.state.rowData);

            let newRow = {};
            self.state.colSpec.map((column) => (
                newRow[column.fieldName] = column.defaultValue || ''
            ));

            tempDataRow.push(newRow);

            self.setState({rowData: tempDataRow});
            self.state.onChange(tempDataRow)
        }
    }

    onDeleteRow(rowId) {
        const self = this;
        return function () {
            let tempDataRow = $.extend(true, [], self.state.rowData);

            tempDataRow.splice(rowId, 1);

            self.setState({rowData: tempDataRow});
            self.state.onChange(tempDataRow)
        }
    }

    onReorderRow(rowId, direction) {
        const self = this;
        return function () {
            let tempDataRow = $.extend(true, [], self.state.rowData);

            let oldIndex = rowId;
            let newIndex = rowId + direction;

            tempDataRow.splice(newIndex, 0, tempDataRow.splice(oldIndex, 1)[0]);

            self.setState({rowData: tempDataRow});
            self.state.onChange(tempDataRow)
        }
    }

    onSemanticFieldChange(rowId, fieldName) {
        const self = this;
        return function (event, data) {
            let newValue = data.value;
            let tempDataRow = $.extend(true, [], self.state.rowData);

            tempDataRow[rowId][fieldName] = newValue;

            self.setState({rowData: tempDataRow});
            self.state.onChange(tempDataRow)
        }
    }
}

export default suiEditableTable;