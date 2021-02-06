import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';

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

export default function FaqHome() {
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
                        You can save backups of individual contacts (from their respective contact page), individual pages of search results, or all existing contacts (from the Configuration page). These saves are formatted as JSON files which you can store on your computer, on a USB, in the cloud, or whereever.
                    </p>
                    <p>
                        Backup files can be used to add back contacts you've removed, or to replace all of your existing contacts if you want to revert to a previous version of your address book.
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="question">
                    What if I lose my backups?
                </div>
                <div className="answer">
                    <p>
                        CourM is an entirely local application. It runs off of the files on your own machine (even without an internet connection). As such, we do not collect ANY user information, including the contact data you input into the system.
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
                        Simply visit <a target="_blank" href="">CourM's public repository</a> and open a ticket. Here's a good guide for <a target="_blank" href="">how to write constructive tickets</a>.
                    </p>
                    <p>
                        When you do create a ticket, please first check existing tickets to make sure you're not creating a duplicate.
                    </p>
                </div>
            </div>
        </ConfigureWrapper>
    );
}
