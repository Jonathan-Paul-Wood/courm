import React from 'react';
import styled from 'styled-components';
import SideBarNavItem from './SideBarNavItem/SideBarNavItem';
import { useLocation } from 'react-router-dom';

const LeftSideBarWrapper = styled.div`
    position: fixed;
    top: 4em;
    width: 8em;
    height: calc(100% - 4em);
    display: flex;
    background-color: #4d4d4d;
    color: white;
    display: grid;
    grid-template-columns: 8em;
    grid-template-rows: 5rem 5rem 5rem 5rem;
`;

const ActiveTab = styled.div`
    background-color: #4da6ff;
`;

export default function LeftSidebar() {
    const location = useLocation();
    const activeTab = location.pathname.split('/')[1];

    const leftNavigationOptions = [
        {
            icon: 'home',
            title: 'Home',
            path: '/home',
        },
        {
            icon: 'people',
            title: 'Contacts',
            path: '/contacts',
        },
    ];

    return (
        <LeftSideBarWrapper>
            {leftNavigationOptions.map((option, index) => {
                return (
                    option.path.match(activeTab) ? (
                        <ActiveTab key={index}>  
                            <SideBarNavItem
                                icon={option.icon}
                                title={option.title}
                                path={option.path}
                            />
                        </ActiveTab>
                    ) : (
                        <SideBarNavItem
                            key={index}
                            icon={option.icon}
                            title={option.title}
                            path={option.path}
                        />
                    )
                )
            })}
        </LeftSideBarWrapper>
    );
}