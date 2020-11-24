import React, { Component } from 'react';
import DataTable from "./DataTable";
import Nav from "./Nav";
import API from "../utils/API";
import "../styles/DataArea.css";


/* 
Defining state with 3 attributes: users, order, filtered user.
*/
export default class DataArea extends Component {
   state = {
       users: [{}],
       order: "descend",
       filteredUsers: [{}]
   } 


// Setting the headings properties for the DataTable object

   headings = [
       {name: "Image", width:"10%"},
       {name: "Name", width:"20%"},
       {name: "Phone", width:"30%"},
       {name: "Email", width:"20%"},
       {name: "DOB", width:"10%"}
   ]

// Set the data to ascending order.
   handleSort = heading => {
       if (this.state.order === "descend") {
        this.setState({
            order: "ascend"
        })
       } else {
        this.setState({
            order: "descend"
        })
       }

// Compare function to sort elements based on if one is greater than the other
    const compareFnc = (a, b) => {
        if (this.state.order === "ascend") {
            if (a[heading] === undefined) {
                return 1;
            } else if (b[heading] === undefined) {
                return -1;
            }
            else if (heading === "name") {
                return a[heading].first.localeCompare(b[heading].first);
            } else {
                return a[heading] - b[heading];
            }
        } else {
            if (a[heading] === undefined) {
                return 1;
            } else if (b[heading] === undefined) {
                return -1;
            }
            else if (heading === "name") {
                return b[heading].first.localeCompare(a[heading].first);
            } else {
                return b[heading] - a[heading];
            }
        }
    }
    const sortedUsers = this.state.filteredUsers.sort(compareFnc);
    this.setState({ filteredUsers: sortedUsers});
   }

//    Defines handleSearchChange for Nav and Searchbox
   handleSearchChange = event => {
       const filter = event.target.value;
       const filteredList = this.state.users.filter(item => {
        //   Merge data and see if users search is inside
            let values = Object.values(item)
                .join("")
                .toLowerCase();
            return values.indexOf(filter.toLowerCase()) !== -1;
       });
       this.setState({ filteredUsers: filteredList});
   }

//   Makes axios call to API and populates users and filteredUsers arrays.
   componentDidMount() {
       API.getUsers().then(results => {
           this.setState({
               users: results.data.results,
               filteredUsers: results.data.results
           });
       });
   }

   render() {
       return (
           <>
           <Nav handleSearchChange={this.handleSearchChange} />
                <div className="data-area">
                    <DataTable
                    headings={this.headings}
                    users={this.state.filteredUsers}
                    handleSort={this.handleSort}
                    />
                </div>
            </>
       );
   }
}