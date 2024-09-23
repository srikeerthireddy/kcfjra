
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import { BrowserRouter } from 'react-router-dom';
import LargeNav from '../src/components/headers/LargeNav/LargeNav';
// import InstagramLogo from '../src/img/logo.png';

describe('LargeNav component tests', () => {
    it('[REQ012]_renders_all_navigation_links_correctly', () => {
        render(
            <BrowserRouter>
                <LargeNav />
            </BrowserRouter>
        );



        // Check individual links
        // Check individual links
        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Search')).toBeTruthy();
        expect(screen.getByText('Followers')).toBeTruthy();
        expect(screen.getByText('Following')).toBeTruthy();
        expect(screen.getByText('Create Post')).toBeTruthy();
        expect(screen.getByText('Profile')).toBeTruthy();
    });
});
