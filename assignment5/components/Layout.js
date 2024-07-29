import MainNav from './MainNav';
import { Container } from 'react-bootstrap';

const Layout = (props) => {
  return (
    <>
      <MainNav />
      <br />
      <Container>
        {props.children}
      </Container>
      <br />
    </>
  );
};

export default Layout;