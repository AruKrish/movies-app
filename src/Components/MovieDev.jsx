import _ from "lodash";
import { React, Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getGenres } from "../Services/genreService";
import { deleteMovie, getMovies } from "../Services/movieService";
import ListGroup from "./Common/listGroup";
import Pagination from "./Common/Pagination";
import SearchBox from "./Common/SearchBox";
import MoviesTable from "./MoviesTable";
import { Paginate } from "./Utils/Paginate";

class MovieDev extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieArray: [],
      genre: [],
      pageSize: 4,
      currentPage: 1,
      searchQuery: "",
      selectedGenre: null,
      sortColumn: { path: "title", order: "asc" },
    };
  }

  async componentDidMount() {
    const { data } = await getGenres();
    const genre = [{ _id: "", name: "All Genre" }, ...data];

    const { data: movieArray } = await getMovies();
    this.setState({ movieArray, genre });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movieArray;
    const del = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ del });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) 
        toast.error("This Movie has been already deleted.");
        this.setState({ del: originalMovies });
    }
  };
  handleLike = (m) => {
    const movieArray = [...this.state.movieArray];
    const index = movieArray.indexOf(m);
    movieArray[index] = { ...movieArray[index] };
    movieArray[index].liked = !movieArray[index].liked;

    this.setState({ movieArray });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      searchQuery,
      movieArray: allMovies,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movieArray = Paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movieArray };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { totalCount, data: movieArray } = this.getPagedData();

    const {user}=this.props
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genre}
            selectedGenre={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user&&(<Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Movie
          </Link>)}

          <div className="col">
            <p>Showing {totalCount} movies in the db</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              movieArray={movieArray}
              sortColumn={sortColumn}
              onLike={this.handleLike}
              onSort={this.handleSort}
              onDelete={this.handleDelete}
            />

            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            ></Pagination>
          </div>
        </div>
      </div>
    );
  }
}
export default MovieDev;
