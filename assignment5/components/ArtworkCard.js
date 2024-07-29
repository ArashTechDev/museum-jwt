// components/ArtworkCard.js
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
import Link from 'next/link';
import Error from 'next/error';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const ArtworkCard = ({ objectID }) => {
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImageSmall,
    title,
    objectDate,
    classification,
    medium
  } = data;

  return (
    <Card>
      <Card.Img
        variant="top"
        src={primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'}
      />
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || 'N/A'}<br />
          <strong>Classification:</strong> {classification || 'N/A'}<br />
          <strong>Medium:</strong> {medium || 'N/A'}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref legacyBehavior>
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
