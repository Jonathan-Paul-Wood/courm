import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Switch, Router, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import axiosSingleton from '../../configs/axiosSingleton';

import ExampleService from '../../services/ExampleService';
import appConfig from '../../configs/appConfig';

import AppRouter from '../routers/AppRouter/AppRouter';
import AppLayout from '../../layouts/AppLayout/AppLayout'

export default function App(props) {
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [timeoutInterval, setTimeoutInterval] = useState(null);

    useEffect(() => {
        axiosSingleton.addListener(callBackEvent =? props.updateSessionLastTimestamp(new Date()));
        axiosSingleton.request();
        setIsSetupComplete(true);
    }, []);

    useEffect(() => {
        if(timeoutInterval) {
            window.clearInterval(timeoutInterval);
        } else {
            props.updateSessionLastTimestamp(new Date());
            //if authentication, get user and server details here
        }
        setTimeoutInterval(
            window.setInterval(() => {
                const timeout = props.appConfig.webServerAbout.timeout;
                const timeElapsed = new Date() - props.user.lastTimestamp;
                if (timeElapsed >= timeout) {
                    onSessionTimeout();
                } else {
                    if (
                        timeElapsed >=
                        props.appConfig.webServerAbout.timout - appConfig.sessionTimeoutWarning
                    ) {
                        const sessionTimeLeft = Math.floor((timout - timeElapsed) / 1000);
                        props.updateSessionTimer(sessionTimeLeft);
                    }
                }
            }, 1000) //check every second
        )
    }, [props.user.lastTimstamp]);

    function handleTimeoutConfirm() {
        //ping server or something to keep session alive
        //reset timer
    }

    function onSessionTimeout() {
        //window.location.assign(urlPath);
    }

    return isSetupComplete ? (
        <div>
            <ErrorBoundary>
                <Switch>
                    <Redirect exact from="/" to="/home" />
                    <AppLayout exact path="/home" component={AppHome} />
                    <Route path="/page/:itemId" component={AppRouter} />
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