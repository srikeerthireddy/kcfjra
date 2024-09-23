
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import { BrowserRouter } from 'react-router-dom';
import MobileNav from '../src/components/headers/MobileNav/MobileNav';

describe('MobileNav component tests', () => {
    it('[REQ013]_renders_all_navigation_links_correctly', () => {
        render(
            <BrowserRouter>
                <MobileNav />
            </BrowserRouter>
        );

        // Check individual icons
        // Check individual icons
        expect(screen.getByTestId('FaHome')).toBeTruthy();
        expect(screen.getByTestId('FaSearch')).toBeTruthy();
        expect(screen.getByTestId('FaUserFriends')).toBeTruthy();
        expect(screen.getByTestId('FaUserPlus')).toBeTruthy();
        expect(screen.getByTestId('FaPlusSquare')).toBeTruthy();
        expect(screen.getByAltText('Profile')).toBeTruthy();
    });

});
