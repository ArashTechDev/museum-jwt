// pages/favourites.js
import { useAtom } from 'jotai';
import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '../components/ArtworkCard';
import { favouritesAtom } from '../store';

const Favourites = () => {
  const [favouritesList] = useAtom(favouritesAtom);

  return (
    <>
      <Row className="gy-4">
        {favouritesList.length > 0 ? (
          favouritesList.map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              <p>Try adding some new artwork to the list.</p>
            </Card.Body>
          </Card>
        )}
      </Row>
    </>
  );
};

export default Favourites;
