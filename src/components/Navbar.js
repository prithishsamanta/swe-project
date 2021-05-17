import React, { Component, Children } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {
	render() {
		return (
			<nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
				<a
					className='navbar-brand col-sm-3 col-md-2 mr-0'
					href='#'
					target='_blank'
					rel='noopener noreferrer'>
					Convert
				</a>
				<p style={{ color: 'white' }}>{this.props.account}</p>
				{/* {this.props.account ? (
					<img
						className='ml-2'
						width='30'
						height='30'
						src={`data:image/png;base64,${
							new Identicon(this.props.account, 30).toString
						}`}
					/>
				) : (
					<span></span> */}
				)}
			</nav>
		);
	}
}

export default Navbar;
