import React from 'react';
import axios from 'axios';
import Search from './Search.jsx';
import ReviewList from './ReviewList.jsx';
import LoggedInUser from './LoggedInUser.jsx';
import Pagination from './Pagination.jsx';
import regeneratorRuntime from "regenerator-runtime";
import styles from '../YelpsReviews.css';



class YelpReviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restName: 'Miss SaiGon',
      sort: 'Newest',
      reviewsInfo: [],
      showPopover: false,
      loggedUser: {
                elite: 0,
                friend: 131,
                location: "San Jose, Ca",
                name: "Jimmy L.",
                numPics: 3,
                reviews: 1,
                picture: "",
                }
    }
  }

  //name should be passed down as props, now just for testing
  //get returns an array of objects
  componentDidMount() {
    this.updateReviews();
  }

  async updateReviews() {
    console.log('updating reviews');
    let name = this.state.restName;
    let rest_id = 551234;
    let sort =  this.state.sort;
    let url = `/restaurantReviews/${rest_id}` ;
    let data = await axios.get(url)
    console.log(data);
    // this.setState({
    //     reviewsInfo: data.data
    // })
  }

  handleSearchInput(search) {
    console.log(search);
  }

  onSelectChange (e) {
    this.setState({sort: e.target.value}, () => this.updateReviews());
  }

  render() {
    return (
    <div>
      <div className={styles.search_container}>
        <div className={styles.search}>
          <Search handleSearchInput={this.handleSearchInput.bind(this)}/> 
        </div>
        <div>
          <select onChange={this.onSelectChange.bind(this)}>
            <option>Newest</option>
            <option>Oldest</option>     
            <option>Highest</option> 
            <option>Lowest</option>  
          </select>
        </div>
      </div>     
      <LoggedInUser userInfo={this.state.loggedUser} hover={false} restName={this.state.restName}/>
      <ReviewList reviews={this.state.reviewsInfo} hover={this.state.hover}/>
      <Pagination/>
    </div>
  )}
}

export default YelpReviews;