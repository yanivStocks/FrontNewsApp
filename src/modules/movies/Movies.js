import React, { PropTypes, Component } from 'react';
import {
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Platform,ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as moviesActions from './movies.actions';
import CardOne from './components/CardOne';
import CardTwo from './components/CardTwo';
import CardThree from './components/CardThree';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/Movies';

//import {
//  Analytics,
//  Hits as GAHits,
//  Experiment as GAExperiment
//} from 'react-native-google-analytics';
//import DeviceInfo from 'react-native-device-info';


//var ga = this.ga = null;

//import { AdMobRewarded } from 'react-native-admob';

import axios from 'axios';

import { TMDB_URL, TMDB_API_KEY } from '../../constants/api';




class Movies extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			currentPage: 1,
			dataSource : {}
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMovies();
//		let clientId = DeviceInfo.getUniqueID();
//            ga = new Analytics('UA-92679050-1', clientId, 1, DeviceInfo.getUserAgent());
//            var screenView = new GAHits.ScreenView(
//              'Feed',
//              'MAIN',
//              DeviceInfo.getReadableVersion(),
//              DeviceInfo.getBundleId()
//            );
//            ga.send(screenView);

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.nowPlayingMovies && nextProps.popularMovies) {
			this.setState({ isLoading: false });
		}
	}

	_retrieveMovies(isRefreshed) {
		this.props.actions.retrieveNowPlayingMovies();
		this.props.actions.retrievePopularMovies();
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_viewMoviesList(type, title) {
		this.props.navigator.showModal({
			title,
			screen: 'movieapp.MoviesList',
			passProps: {
				type
			}
		});
	}

	_viewMovie(movieId, articleurl , body ) {
		this.props.navigator.showModal({
			screen: 'movieapp.Movie',
			passProps: {
				movieId,
				articleurl,
				body
			}
		});
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMovies('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'search') {
				this.props.navigator.showModal({
					screen: 'movieapp.Search',
					title: 'Search'
				});
			}
		}
	}

	render() {
		const { nowPlayingMovies, popularMovies } = this.props;
		const iconPlay = <Icon name="md-play" size={21} color="#9F9F9F" style={{ paddingLeft: 3, width: 22 }} />;
		const iconTop = <Icon name="md-trending-up" size={21} color="#9F9F9F" style={{ width: 22 }} />;
		const iconUp = <Icon name="md-recording" size={21} color="#9F9F9F" style={{ width: 22 }} />;
		console.log("now playing ", nowPlayingMovies)
		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh}
						colors={['#EA0000']}
						tintColor="white"
						title="loading..."
						titleColor="white"
						progressBackgroundColor="white"
					/>
				}>
				<Swiper
					autoplay
					autoplayTimeout={4}
					showsPagination={false}
					height={248}
					style={styles.marginItem}>
					{nowPlayingMovies.results.data.map(info => (
						<CardOne key={info.id} info={info} viewMovie={this._viewMovie} />
					))}
				</Swiper>
				<View>
					<View style={styles.listHeading}>
						{/*<Text style={styles.listHeadingLeft}>Popular</Text>
						<TouchableOpacity>
							<Text
								style={styles.listHeadingRight}
								onPress={this._viewMoviesList.bind(this, 'popular', 'Popular')}>
								See all
							</Text>
						</TouchableOpacity> */}
					</View>
					<ScrollView vertical showsVerticalScrollIndicator={false} >
						{popularMovies.results.data.map(info => (
							<View style={styles.marginItem}>
							<CardThree key={info.id} info={info} viewMovie={this._viewMovie} style={styles.marginItem}/>
							</View>
						))}
					</ScrollView>
					{/*<View style={styles.browseList}>
						<TouchableOpacity activeOpacity={0.7}>
							<View style={styles.browseListItem}>
								{iconPlay}
								<Text
									style={styles.browseListItemText}
									onPress={this._viewMoviesList.bind(this, 'now_playing', 'Now Playing')}>
									Now Playing
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7}>
							<View style={styles.browseListItem}>
								{iconTop}
								<Text style={styles.browseListItemText} onPress={this._viewMoviesList.bind(this, 'top_rated', 'Top Rated')}>
									Top Rated
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7}>
							<View style={styles.browseListItem}>
								{iconUp}
								<Text
									style={styles.browseListItemText}
									onPress={this._viewMoviesList.bind(this, 'upcoming', 'Upcoming')}>
									Upcoming
								</Text>
							</View>
						</TouchableOpacity>
					</View> */}
				</View>
			</ScrollView>
		);
	}
}

Movies.propTypes = {
	actions: PropTypes.object.isRequired,
	nowPlayingMovies: PropTypes.object.isRequired,
	popularMovies: PropTypes.object.isRequired,
	navigator: PropTypes.object
};


let rightButtons = [];

if (Platform.OS === 'ios') {
	rightButtons = [
		{
			id: 'search',
			icon: require('../../img/ios-search.png') // eslint-disable-line
		}
	];
}

Movies.navigatorButtons = {
	rightButtons
};

function mapStateToProps(state, ownProps) {
	return {
		nowPlayingMovies: state.movies.nowPlayingMovies,
		popularMovies: state.movies.popularMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
