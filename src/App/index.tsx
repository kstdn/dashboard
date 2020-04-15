import React, { FC } from 'react';
import { Grid, User } from 'react-feather';
import { Divider } from '../shared/components/Divider';
import { ThemeToggle } from '../shared/components/ThemeToggle';
import { GlobalStyle } from 'styles/global.style';
import { Container } from './Container';
import { Main } from './Container/Main';
import { Sidebar } from './Container/Sidebar';
import { SidebarLink } from './Container/Sidebar/SidebarLink';
import { Route, Routes } from './Routes';
import { useTheme } from './useTheme';
import { Router } from 'react-router-dom';
import history from 'util/history';

export const App: FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      <GlobalStyle theme={theme} />
      <Container>
        <Router history={history}>
          <Sidebar>
            <SidebarLink to={Route.Authentication} icon={<User />}>
              Login
            </SidebarLink>
            <SidebarLink to={Route.Dashboard} icon={<Grid />}>
              Dashboard
            </SidebarLink>
            <Divider />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </Sidebar>
          <Main>
            <Routes />
          </Main>
        </Router>
      </Container>
    </>
  );
};