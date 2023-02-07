import React from 'react';
import styled from 'styled-components';

const ConfigureWrapper = styled.div`
    padding: 0 1em;

    .section {
        padding: 1em;
    }

    .section:not(:last-child) {
        border-bottom: solid black 1px;
    }

    .question {
        font-size: 2em;
    }

    .answer {

    }
`;

export default function FaqHome () {
    return (
        <ConfigureWrapper>
            <h2>FAQ Page</h2>
            <hr/>
            <div className="section">
                <div className="question">
                    How do backups work?
                </div>
                <div className="answer">
                    <p>
                        You can save backups of individual contacts (from their respective contact page), individual pages of search results, or all existing contacts (from the Configure page). These saves are formatted as JSON files which you can store on your computer, on a USB, in the cloud, or whereever.
                    </p>
                    <p>
                        Backup files can be used to add back contacts you've removed, or to replace all of your existing contacts if you want to revert to a previous version of your address book.
                    </p>
                    <p>
                        You can select a specific record type to export/import (eg, use a file that only has Notes), or group all your records in a single file.
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="question">
                    What if I lose my backups?
                </div>
                <div className="answer">
                    <p>
                        CouRM is an entirely local application. It runs off of the files on your own machine (even without an internet connection). As such, we do not collect ANY user information, including the contact data you input into the system.
                    </p>
                    <p>
                        YOU ARE ENTIRELY RESPONSIBLE FOR YOUR OWN BACKUPS AND SAVES.
                    </p>
                    <p>
                        To help protect against data loss, you may wish to make regular backups, and copy those files onto at least one other machine besides this one (USB stick, cloud folder, etc).
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="question">
                    How do I report bugs or request features?
                </div>
                <div className="answer">
                    <p>
                        Simply visit <a target="_blank" rel="noreferrer" href="https://github.com/Jonathan-Paul-Wood/courm/issues">CouRM's public repository</a> and open a ticket. You can use the search function there to ensure your issue is a new one.
                    </p>
                    <p>
                        When you do create a ticket, be descriptive in what the issue is by including steps to reproduce (screenshots can be extra helpful). These steps will help ensure that issues reported are clear and easy to address.
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="question">
                    How do I block trackers?
                </div>
                <div className="answer">
                    <p>
                        Great news! CouRM does not track you at all. Since this is a locally run application, everything you need is on your own machine.
                        We don't install any cookies or other trackers on your device, we don't serve ads, and we don't collect any data to send to third parties.
                    </p>
                    <p>
                        CouRM is private by design, so you and only you are in control of your data. We do not collect or store any of your data.
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="question">
                    What about software updates?
                </div>
                <div className="answer">
                    <p>
                        CouRM does not connect to the internet, as such CouRM cannot check for updates. You will need to proactively check for updates, which you can find at <a target="_blank" rel="noreferrer" href="https://www.jonathanpaulwood.com/courm/">this link</a>.
                    </p>
                    <p>
                        You will then be able to download the latest version and start using it immediately. Your data can be ported over to the new version by using the Export and Import features
                        in the 'Configure' page.
                    </p>
                </div>
            </div>
        </ConfigureWrapper>
    );
}
