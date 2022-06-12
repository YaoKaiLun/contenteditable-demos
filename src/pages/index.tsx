import React from 'react';
import { NavLink } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="index-page" style={{ width: '500px', padding: '50px' }}>
      <ul>
        <li>
          <NavLink to='/beforeinput'>beforeInput</NavLink>
        </li>
        <li>
          <NavLink to='/mutation'>MutationObserver</NavLink>
        </li>
        <li>
          <NavLink to='/custom'>customRender</NavLink>
        </li>
      </ul>
    </div>
  );
}