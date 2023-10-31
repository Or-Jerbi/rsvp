import React, { useState, useEffect } from "react";
import axios from "axios";


function Main() {

    // const updateTokens = () => {
    //     axios.post('http://localhost:8081/updateAllTokens')
    //         .then((response) => {
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('Error updating tokens:', error);
    //         });
    // }

    // useEffect(() => {
    //     updateTokens();
    // });

    const [values, setValues] = useState ({
        guestsNumber:'0',
        attending: 'Yes',
    })

    const [data, setData] = useState([]);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        console.log("token: " + token);
        axios.get(`http://localhost:8081/data?token=${token}`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.id]: event.target.value });
    }

    const handleSubmit = (event) => {
        console.log(values);
        event.preventDefault();
        const token = new URLSearchParams(window.location.search).get('token')
        console.log("token: " + token)
        axios.post('http://localhost:8081/insert', {token,...values}) 
            .then((res) => {
                console.log("Thanks for your update");
            })
            .catch((err) => {
                console.log(err);
            });
    }
        
    return (
        <div>
            <form id="rsvpForm" className="center-form" onSubmit={handleSubmit}>
            <h1>
                Hello&nbsp;
                {data.map((item) => (
                    <span key={item.full_name}>{item.full_name}</span>
                ))}
            </h1>
            <label>Are you attending?</label>
            <div style={{ display: 'flex' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <input
                        type="radio"
                        id="attending"
                        value="yes"
                        checked={values.attending === "yes"}
                        onChange={handleChange}
                    />
                    Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <input
                        type="radio"
                        id="attending"
                        value="no"
                        checked={values.attending === "no"}
                        onChange={handleChange}
                    />
                    No
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <input
                        type="radio"
                        id="attending"
                        value="maybe"
                        checked={values.attending === "maybe"}
                        onChange={handleChange}
                    />
                    Maybe
                </label>
            </div>

                <label htmlFor="guestsNumber">Number of Guests (including yourself):</label>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input type="number" id="guestsNumber" onChange={handleChange} required min="0" value={values.guestsNumber} />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Main;
