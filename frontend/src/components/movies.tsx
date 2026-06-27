import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MovieDataService } from "../services/movies";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import dayjs from 'dayjs'
import moment from 'moment';

type User = {
  name: string;
  id: string;
};
type Review = {
  id: string;
  name: string;
  user_id: string;
  date: string;
  review: string;
};

type MovieType = {
  _id?: string;
  title: string;
  rated?: string;
  poster?: string;
  plot?: string;
  reviews: Review[];
};

type MovieProps = {
  user: User | null;
};

const Movie = ({ user }: MovieProps) => {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<MovieType>({
    title: "",
    rated: "",
    poster: "",
    plot: "",
    reviews: []
  });

  useEffect(() => {
    if (!id) return;
    let alive = true;

    const fetchMovie = async () => {
      try {
        const response = await MovieDataService.get(id);
        if (!alive) return;
        setMovie(response.data as MovieType);
      } catch (e) {
        console.error("Failed to fetch movie:", e);
      }
    };

    fetchMovie();

    return () => {
      alive = false;
    };
  }, [id]);

  const deleteReview = async (reviewId: string) => {
    if (!id) return;
    try {
      await MovieDataService.deleteReview(id, reviewId);
      const updatedReviews = movie.reviews.filter((r) => r.id !== reviewId);
      setMovie({ ...movie, reviews: updatedReviews });
    } catch (e) {
      console.error("Failed to delete review:", e);
    }
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col md={4}>
            {movie.poster ? (
              <Image src={`/${movie.poster}`} fluid alt={movie.title} />
            ) : (
              <div style={{ width: 150, height: 250, background: "#eee" }} />
            )}
          </Col>

          <Col md={8}>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot ?? ""}</Card.Text>

                {user && (
                  <Link to={`/movies/${id}/review`} className="btn btn-primary">
                    Add Review
                  </Link>
                )}
              </Card.Body>
            </Card>

            <br />
            <h2>Reviews</h2>
            <br />
            {movie.reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              movie.reviews.map((review) => (
                <Card key={review.id} className="mb-3">
                  <Card.Body>
                    <h5>
                      {review.name} reviewed on{" "}
                      {dayjs(review.date).format("DD MMMM YYYY ")}
                      {moment(review.date).format("hh:mm A")}
                    </h5>
                    <p>{review.review}</p>

                    {user && user.id === review.user_id && (
                      <Row>
                        <Col>
                          <Link
                            to={`/movies/${id}/review`}
                            className="btn btn-outline-primary btn-sm">
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteReview(review.id)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Movie;