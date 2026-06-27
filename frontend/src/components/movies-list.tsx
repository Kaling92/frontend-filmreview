import { useEffect, useState, type ChangeEvent } from "react";
import { MovieDataService } from "../services/movies";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

type MovieListItem = {
    _id: string;
    title: string;
    rated?: string;
    poster?: string;
    plot?: string;
};

type MoviesResponse = {
    movies: MovieListItem[];
    page: number;
    entries_per_page: number;
};

const MoviesList = () => {
    const [movies, setMovies] = useState<MovieListItem[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchRating, setSearchRating] = useState<string>("All Ratings");
    const [ratings, setRatings] = useState<string[]>(["All Ratings"]);

    const [currentPage, setCurrentPage] = useState<number>(0);

    const retrieveMovies = async (page: number) => {
        try {
            const response = await MovieDataService.getAll(page);
            const data = response.data as MoviesResponse;

            setMovies(data.movies);
            setCurrentPage(data.page);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        (async () => {
            await retrieveMovies(currentPage);
        })();
    }, [currentPage]);


    const retrieveRatings = async () => {
        try {
            const response = await MovieDataService.getRating();
            setRatings(["All Ratings", ...response.data]);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        (async () => {
            await retrieveRatings();
        })();
    }, []);


    const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTitle(e.target.value);
    };

    const onChangeSearchRating = (e: ChangeEvent<HTMLSelectElement>) => {
        setSearchRating(e.target.value);
    };

    const find = async (query: string, by: "title" | "rated", page: number) => {
        try {
            const response = await MovieDataService.find(query, by, page);
            const data = response.data as MoviesResponse;

            setMovies(data.movies);
            setCurrentPage(data.page);
        } catch (e) {
            console.error(e);
        }
    };
    const findByTitle = async () => {
        setCurrentPage(0);
        await find(searchTitle, "title", 0);
    };
    const findByRating = async () => {
        setCurrentPage(0);

        if (searchRating === "All Ratings") {
            await retrieveMovies(0);
        } else {
            await find(searchRating, "rated", 0);
        }
    };

    return (

            <Container>
                <h2 className="my-3">Movie Search</h2>

                <Form className="mb-4">
                    <Row>
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={searchTitle}
                                onChange={onChangeSearchTitle}
                            />
                            <Button className="mt-2" onClick={findByTitle}>
                                Search
                            </Button>
                        </Col>

                        <Col md={6}>
                            <Form.Select value={searchRating} onChange={onChangeSearchRating}>
                                {ratings.map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button className="mt-2" onClick={findByRating}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row className="g-4">
                    {movies.map((movie) => (
                        <Col md={4} key={movie._id}>
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={movie.poster ? `${movie.poster}/100px180` : ""}
                                    alt={movie.title}
                                />
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Rating :</strong> {movie.rated ?? ""}
                                    </Card.Text>
                                    <Card.Text>{movie.plot ?? ""}</Card.Text>
                                    <Link to={`/movies/${movie._id}`}>View Reviews</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

export default MoviesList;
