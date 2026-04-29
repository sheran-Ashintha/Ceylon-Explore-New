import React from "react";
import "./Header.css";

function Header() {
  return (
    <div id="b_header">
      <div className="b_logoArea">
        <a className="b_logo" href="#" aria-label="Home">Travel Site</a>
      </div>
      <div className="b_searchboxForm">
        <input type="text" className="b_searchbox" placeholder="Where do you want to go?" id="sb_form_q" />
        <div id="sb_search">
          <button className="b_searchboxSubmit" type="submit">Search</button>
        </div>
      </div>
      <nav className="b_scopebar">
        <ul>
          <li className="b_active"><a href="#">Home</a></li>
          <li><a href="#">Hotels</a></li>
          <li><a href="#">Flights</a></li>
          <li><a href="#">Packages</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
