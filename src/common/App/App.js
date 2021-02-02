import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import '../../../node_modules/bootstrap/scss/bootstrap.scss';
import {firebase} from "../../../node_modules/firebase/firebase.js";

import PropTypes from 'prop-types';
import axiosSingleton from '../../configs/axiosSingleton';

import ExampleService from '../../services/ExampleService';
import appConfig from '../../configs/appConfig';
import AppRouter from '../routers/AppRouter/AppRouter';

const ErrorBoundary = styled.div`
`;//todo: make it's own component. Wraps around and overlays screen if there is an error message

export default function App(props) {
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [timeoutInterval, setTimeoutInterval] = useState(null);

    useEffect(() => {
        axiosSingleton.addListener(callBackEvent => props.updateSessionLastTimestamp(new Date()));
        axiosSingleton.request();
        setIsSetupComplete(true);
    }, []);

    // useEffect(() => {
    //     if(timeoutInterval) {
    //         window.clearInterval(timeoutInterval);
    //     } else {
    //         props.updateSessionLastTimestamp(new Date());
    //         //if authentication, get user and server details here
    //     }
    //     setTimeoutInterval(
    //         window.setInterval(() => {
    //             const timeout = props.appConfig.webServerAbout.timeout;
    //             const timeElapsed = new Date() - props.user.lastTimestamp;
    //             if (timeElapsed >= timeout) {
    //                 onSessionTimeout();
    //             } else {
    //                 if (
    //                     timeElapsed >=
    //                     props.appConfig.webServerAbout.timout - appConfig.sessionTimeoutWarning
    //                 ) {
    //                     const sessionTimeLeft = Math.floor((timeout - timeElapsed) / 1000);
    //                     props.updateSessionTimer(sessionTimeLeft);
    //                 }
    //             }
    //         }, 1000) //check every second
    //     )
    // }, [props.user.lastTimstamp]);

    function handleTimeoutConfirm() {
        //ping server or something to keep session alive
        //reset timer
    }

    function onSessionTimeout() {
        //window.location.assign(urlPath);
    }

    //TODO: this var needs to be a piece of state so accessible to other components, or pass prop
    // var firebaseConfig = {
    //     apiKey: "AIzaSyCbOFXJEKiJ2wtX1_HlnCwdD7JJBB8Aoxs",
    //     authDomain: "c-our-m.firebaseapp.com",
    //     databaseURL: "https://c-our-m-default-rtdb.firebaseio.com",
    //     projectId: "c-our-m",
    //     storageBucket: "c-our-m.appspot.com",
    //     messagingSenderId: "57532612460",
    //     appId: "1:57532612460:web:8a97e206b50ac502c4bd49"
    // };
    // firebase.initializeApp(firebaseConfig);

    return isSetupComplete ? (
        <div>
            <ErrorBoundary>
                <Switch>
                    <Redirect exact from="/" to="home" />
                    <AppRouter path="/home" component={AppRouter} />
                    <AppRouter path="/contacts/:contactId" component={AppRouter} />
                    <AppRouter path="/contacts/new" component={AppRouter} />
                    <AppRouter path="/contacts" component={AppRouter} />
                    <AppRouter path="/configure" component={AppRouter} />
                    {/*<Route path="/interactions/:interactionId" component={App} /> */}
                    {/* <Route path="/interactions" component={App} /> */}
                    {/* <Route exact path="/statistics" component={App} /> */}
                </Switch>
            </ErrorBoundary>

            <ToastContainer
                hideProgressBar={true}
                position={toast.POSITION.TOP_RIGHT}
                transition={Slide}
                autoClose={2000}
            />

            {/* <ConfirmModal

            />
            <UnsavedChangesModal /> */}
        </div>
    ) : (
        <></>
    ) //todo: make loading spinner
}