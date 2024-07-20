// pages/history.js
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ListGroup, Card, Button } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';
import styles from '@/styles/History.module.css';

const History = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  const historyClicked = (e, index) => {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  const removeHistoryClicked = (e, index) => {
    e.stopPropagation();
    setSearchHistory(current => {
      let x = [...current];
      x.splice(index, 1);
      return x;
    });
  };

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for some artwork.</p>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={e => historyClicked(e, index)}
              className={styles.historyListItem}
            >
              {Object.keys(historyItem).map(key => (
                <div key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </div>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={e => removeHistoryClicked(e, index)}
              >&times;</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default History;
