import { Form, Input, Button, Space, Modal, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CheckCircleFilled, CloseOutlined } from '@ant-design/icons';
import BarcodeReader from 'react-barcode-reader';
import React, { useRef, useState } from 'react';
import './styles.css'

const App = () => {

    const [formValues, setFormValues] = useState([{ asset_id: "" }])

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }

    let addFormFields = () => {
        setFormValues([...formValues, { asset_id: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(formValues));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-inline">
                <label>Storage ID</label>
                <input type="text" name="storage_id" />
            </div>
            {formValues.map((element, index) => (
                <>
                    <div className="form-inline" key={index}>
                        <label>Asset &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <input type="text" name="asset_id" onChange={e => handleChange(index, e)} />
                        {/* <label>Email</label>
              <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} /> */}
                        {
                            index ?
                                <button type="button" className="button remove" onClick={() => removeFormFields(index)}>Remove</button>
                                : null
                        }
                    </div>
                </>
            ))}
            <div className="button-section">
                <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
                <button className="button submit" type="submit">Submit</button>
            </div>
        </form>
    )
}

export default App