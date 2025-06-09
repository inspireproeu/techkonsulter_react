import React, {
    useEffect,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import * as moment from 'moment';
import { fetchPut } from '../../../utils/utils';
import { DATAURLS } from '../../../utils/constants'
import { getAccessToken } from '@/utils/authority';
import { PlusOutlined, DeleteFilled, DownloadOutlined, UploadOutlined, StopOutlined, CloseCircleOutlined, SwapOutlined } from '@ant-design/icons';

export default forwardRef((props, ref) => {
    const [date, setDate] = useState(props.data.arrived_time ? ((props.data.arrived_time)) : null);
    const [picker, setPicker] = useState(null);
    const refFlatPickr = useRef();
    const refInput = useRef();
    console.log("date", date)
    const onDateChanged = selectedDates => {
        const [selectedDate] = selectedDates;
        console.log("selectedDates",selectedDates)
        setDate(selectedDate);
        let obj = {}
        obj.arrived_time = (moment(new Date(selectedDates)).format() || null);
        obj.id = props.data.id
        delete obj.user_created
        delete obj.user_updated
        props.data.arrived_time = moment(new Date(selectedDates)).format();

        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    // props.setSnackBarOpen(true)
                    // props.setSnackBarMessage(`Arrived date has been updated for ${response.data.id}`)
                    // props.setSnackBarType("success")
                } else {
                }
            })
            .catch((err) => {
                throw err;
            });
        //   props.onDateChanged();
    };

    useEffect(() => {
        setPicker(
            flatpickr(refFlatPickr.current, {
                onChange: onDateChanged,
                // dateFormat: 'Z',
                wrap: true,
                enableTime: true,
                enableSeconds: false,
                time_12hr: true,
                // dateFormat: "F j, Y h:i K"
            })
        );
    }, []);

    useEffect(() => {
        if (picker) {
            picker.calendarContainer.classList.add('ag-custom-component-popup');
        }
    }, [picker]);

    useEffect(() => {
        if (picker) {
            picker.setDate(date);
        }
    }, [date, picker]);

    useImperativeHandle(ref, () => ({
        getDate() {
            return date;
        },

        setDate(date) {
            setDate(date);
        },

        setInputPlaceholder(placeholder) {
            if (refInput.current) {
                refInput.current.setAttribute('placeholder', placeholder);
            }
        },

        setInputAriaLabel(label) {
            if (refInput.current) {
                refInput.current.setAttribute('aria-label', label);
            }
        }
    }));

    return (
        <div
            className="ag-input-wrapper custom-date-filter"
            role="presentation"
            ref={refFlatPickr}
        >
            <input type="text" ref={refInput} data-input style={{ width: '100%' }} value={date}/>
            <a className="input-button" title="clear" data-clear>
                <DownloadOutlined />
            </a>
        </div>
    );
});
