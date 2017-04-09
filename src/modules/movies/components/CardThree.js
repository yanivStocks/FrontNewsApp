/* eslint-disable new-cap */
import React, { PropTypes, Component } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { TMDB_IMG_URL } from '../../../constants/api';
import styles from './styles/CardThree';

const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;

class CardThree extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const { info, viewMovie } = this.props;
		return (
			<View style={styles.cardContainer}>
				<TouchableOpacity activeOpacity={0.9} onPress={viewMovie.bind(this, info.id, info.articleurl , info.body)}>
					<View style={styles.card}>
						<Image source={{ uri: info.imagelink }} style={styles.cardImage} />
						<View style={styles.cardDetails}>
							<Text
								style={styles.cardTitle}
								numberOfLines={3}>
								{info.title}
							</Text>
							<View style={styles.cardGenre}>
								<Text style={styles.cardGenreItem}>{info.subtitle}</Text>
							</View>
							<Text style={styles.cardDescription} numberOfLines={3}>
								By {info.writer}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

CardThree.propTypes = {
	info: PropTypes.object.isRequired,
	viewMovie: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
	return {
		moviesGenres: state.movies.genres
	};
}

export default connect(mapStateToProps, null)(CardThree);
