// pages/search.js
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';

const AdvancedSearch = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const submitForm = (data) => {
    let queryString = 'searchBy=true';

    if (data.geoLocation) {
      queryString += `&geoLocation=${data.geoLocation}`;
    }
    if (data.medium) {
      queryString += `&medium=${data.medium}`;
    }
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;

   
    setSearchHistory(current => [...current, queryString]);

    router.push(`/artwork?${queryString}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register("searchBy")}>
              <option value="artistOrCulture">Artist or Culture</option>
              <option value="title">Title</option>
              <option value="tags">Tags</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" {...register("geoLocation")} />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" {...register("medium")} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox" 
              label="On View"
              {...register("isOnView")} 
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox" 
              label="Highlight"
              {...register("isHighlight")} 
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Query</Form.Label>
            <Form.Control 
              type="text" 
              {...register("q", { required: true })} 
              className={errors.q ? "is-invalid" : ""}
            />
            {errors.q && <div className="invalid-feedback">This field is required</div>}
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="primary">Search</Button>
    </Form>
  );
};

export default AdvancedSearch;
