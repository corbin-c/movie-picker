import React from "react";

import { Link } from "react-router-dom";

function IncompletePersons(props) {
  const { persons } = props;
  return (
    <ul>
      <li className="col-span-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fillRule="evenodd" d="M3.5 8a5.5 5.5 0 118.596 4.547 9.005 9.005 0 015.9 8.18.75.75 0 01-1.5.045 7.5 7.5 0 00-14.993 0 .75.75 0 01-1.499-.044 9.005 9.005 0 015.9-8.181A5.494 5.494 0 013.5 8zM9 4a4 4 0 100 8 4 4 0 000-8z"></path>
          <path d="M17.29 8c-.148 0-.292.01-.434.03a.75.75 0 11-.212-1.484 4.53 4.53 0 013.38 8.097 6.69 6.69 0 013.956 6.107.75.75 0 01-1.5 0 5.193 5.193 0 00-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0017.29 8z"></path>
        </svg>
        <ul>
          { persons.map(e => (
            <li key={ e.name } >
              <Link
                to={ "/person/"+e.name }
                title={ "View more about "+e.name }>
                {e.name}
              </Link>
            </li>
          )) }
        </ul>
      </li>
    </ul>
  )
}

export default IncompletePersons;