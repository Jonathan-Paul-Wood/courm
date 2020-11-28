import React from 'react';
import styled from 'styled-components';
import SideBarNavItem from './SideBarNavItem/SideBarNavItem';
import leftNavigationOptions from '../../../configs/appConfig';

const LeftSideBarWrapper = styled.div`
    position: fixed;
    top: 4em;
    width: 8em;
    height: calc(100% - 4em);
    display: flex;
    background-color: gray;
    color: white;
`;

export default function LeftSidebar() {

    const leftNavigationOptions = [
        {
            icon: 'home',
            title: 'Home',
            path: '/home',
        },
        // {
        //     icon: 'people',
        //     title: 'Contacts',
        //     path: '/contacts',
        // },
    ]

    return (
        <LeftSideBarWrapper>
            {leftNavigationOptions.map(option => {
                return (
                    <SideBarNavItem
                        icon={option.icon}
                        title={option.title}
                        path={option.path}
                    />
                )
            })}
        </LeftSideBarWrapper>
    );
}