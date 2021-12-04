import React from 'react';
import styled from 'styled-components';
import SideBarNavItem from './SideBarNavItem/SideBarNavItem';
import { useLocation } from 'react-router-dom';

const LeftSideBarWrapper = styled.div`
    position: fixed;
    width: 8em;
    height: 100%;
    display: flex;
    background-color: #4d4d4d;
    color: white;
    display: grid;
    grid-template-columns: 8em;
    grid-template-rows: 5rem 5rem 5rem 5rem 5rem;
`;

const ActiveTab = styled.div`
    background-color: #4da6ff;
`;

export default function LeftSidebar () {
    const location = useLocation();
    const activeTab = location.pathname.split('/')[1];

    const leftNavigationOptions = [
        {
            icon: 'home',
            title: 'Home',
            path: '/home'
        },
        {
            icon: 'people',
            title: 'Contacts',
            path: '/contacts'
        },
        {
            icon: 'notes',
            title: 'Notes',
            path: '/notes'
        },
        {
            icon: 'tools',
            title: 'Configure',
            path: '/configure'
        },
        {
            icon: 'question',
            title: 'FAQ',
            path: '/faq'
        }
    ];

    return (
        <LeftSideBarWrapper>
            {leftNavigationOptions.map((option, index) => {
                return (
                    option.path.match(activeTab)
                        ? (
                            <ActiveTab key={index}>
                                <SideBarNavItem
                                    icon={option.icon}
                                    title={option.title}
                                    path={option.path}
                                />
                            </ActiveTab>
                        )
                        : (
                            <SideBarNavItem
                                key={index}
                                icon={option.icon}
                                title={option.title}
                                path={option.path}
                            />
                        )
                );
            })}
        </LeftSideBarWrapper>
    );
}
