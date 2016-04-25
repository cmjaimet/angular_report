var pnCorepress = angular.module( 'pnCorepress', [] );
pnCorepress.controller( 'ctrlCorepress', function( $scope, $http ) {
	$scope.full_data = {};
	$scope.markets = {
		ch: { name: 'Calgary Herald', domain: 'postmediacalgaryherald2.wordpress.com' },
		ej: { name: 'Edmonton Journal', domain: 'postmediaedmontonjournal2.wordpress.com' },
		mg: { name: 'Montreal Gazette', domain: 'postmediamontrealgazette2.wordpress.com' },
		oc: { name: 'Ottawa Citizen', domain: 'postmediaottawacitizen2.wordpress.com' },
		sp: { name: 'Saskatoon StarPhoenix', domain: 'postmediathestarphoenix2.wordpress.com' },
		vp: { name: 'Vancouver Province', domain: 'theprovince.wpdqa3.canada.com' },
		vs: { name: 'Vancouver Sun', domain: 'postmediavancouversun2.wordpress.com' },
	}
	$scope.modes = {
		cats: 'Categories',
		menus: 'Menus',
		tags: 'Tags',
		mcats: 'All Cats',
	}
	$scope.market = Object.keys( $scope.markets )[0];
	$scope.mode = Object.keys( $scope.modes )[0];

	$scope.setCellObject = function( _idx, _typ, _label, _url, _img ) {
		var _obj = {
			key: 'pn_cp_' + _typ.toLowerCase() + '_' + _idx,
			typ: _typ,
			label: _label,
			url: _url,
			img: _img
		};
		return _obj;
	};

	$scope.getReport = function( _obj ) {
		if ( angular.isObject( _obj ) ) {
			console.log(_obj.target.attributes.id.value);
			console.log(_obj);
			if ( angular.isObject( _obj.target.attributes['ng-mode'] ) ) {
				$scope.mode = _obj.target.attributes['ng-mode'].value;
				jQuery( '#pn_cp_menu_modes' ).find( 'li' ).removeClass( 'chosen' );
			}
			if ( angular.isObject( _obj.target.attributes['ng-market'] ) ) {
				$scope.market = _obj.target.attributes['ng-market'].value;
				jQuery( '#pn_cp_menu_markets' ).find( 'li' ).removeClass( 'chosen' );
			}
			jQuery( '#' + _obj.target.attributes.id.value ).addClass( 'chosen' );
		}
		if ( angular.isObject( $scope.full_data[ $scope.market ] ) ) {
			switch( $scope.mode ) {
				case 'tags':
					$scope.getSingleTag();
					break;
				case 'mcats':
					$scope.getMultipleCategory();
					break;
				case 'cats':
					$scope.getSingleCategory();
					break;
				case 'menus':
				default:
					$scope.getSingleMenu();
					break;
			}
		}
	}

	$scope.getSingleMenu = function() {
		var _data = [];
		var _count = 0;
		var _max = Object.keys( $scope.full_data[ $scope.market ].data.menus ).length;
		Object.keys( $scope.full_data[ $scope.market ].data.menus ).forEach( function( _elem, _idx, _ids ) {
			_data.push( {
				Sort: $scope.full_data[ $scope.market ].data.menus[ _elem ].name.name,
				Name: $scope.setCellObject(
					_idx,
					'Name',
					$scope.full_data[ $scope.market ].data.menus[ _elem ].name.name,
					$scope.getMenuUrl( $scope.full_data[ $scope.market ].data.menus[ _elem ].name.id, $scope.markets[ $scope.market ].domain ),
					''
				),
				Count: $scope.setCellObject(
					_idx,
					'Count',
					$scope.full_data[ $scope.market ].data.menus[ _elem ].items.length,
					'',
					''
				),
			} );
			_count ++;
			if ( ( _count + 1 ) > _max ) {
				// sort and maybe group hierarchically
				$scope.table_data = _data;
			}
		} );
	};
	
	$scope.getSingleTag = function() {
		var _data = [];
		var _count = 0;
		var _max = Object.keys( $scope.full_data[ $scope.market ].data.tags ).length;
		Object.keys( $scope.full_data[ $scope.market ].data.tags ).forEach( function( _elem, _idx, _ids ) {
			_data.push( {
				Sort: $scope.full_data[ $scope.market ].data.tags[ _elem ].slug,
				Name: $scope.setCellObject(
					_idx,
					'Name',
					$scope.full_data[ $scope.market ].data.tags[ _elem ].name,
					$scope.getTermUrl( _ids[ _idx ], 'post_tag', $scope.market ),
					''
				),
				Slug: $scope.setCellObject(
					_idx,
					'Slug',
					$scope.full_data[ $scope.market ].data.tags[ _elem ].slug,
					'',
					''
				),
			} );
			_count ++;
			if ( ( _count + 1 ) > _max ) {
				// sort and maybe group hierarchically
				$scope.table_data = _data;
			}
		} );
	};
	
	$scope.getSingleCategory = function() {
		var _data = [];
		var _count = 0;
		var _max = Object.keys( $scope.full_data[ $scope.market ].data.categories ).length;
		Object.keys( $scope.full_data[ $scope.market ].data.categories ).forEach( function( _elem, _idx, _ids ) {
			var _advertorial = { mode: '', img: '', url: '' };
			if ( angular.isObject( $scope.full_data[ $scope.market ].data.categories[ _elem ].meta ) && ( 'on' === $scope.full_data[ $scope.market ].data.categories[ _elem ].meta.on ) ) {
				_advertorial = {
					mode: $scope.full_data[ $scope.market ].data.categories[ _elem ].meta.mode.replace( '_', ' ' ),
					img: $scope.full_data[ $scope.market ].data.categories[ _elem ].meta.img,
					url: $scope.full_data[ $scope.market ].data.categories[ _elem ].meta.url,
				};
			}
			_data.push( {
				Sort: $scope.full_data[ $scope.market ].data.categories[ _elem ].slug,
				Name: $scope.setCellObject(
					_idx,
					'name',
					$scope.full_data[ $scope.market ].data.categories[ _elem ].name,
					$scope.getTermUrl( _ids[ _idx ], 'category', $scope.market ),
					''
				),
				Slug: $scope.setCellObject(
					_idx,
					'slug',
					$scope.full_data[ $scope.market ].data.categories[ _elem ].slug,
					'',
					''
				),
				Sidebar: $scope.setCellObject(
					_idx,
					'sidebar',
					$scope.getFullDataValue( $scope.full_data[ $scope.market ].data, [ 'sidebars', 'sidebars', $scope.full_data[ $scope.market ].data.categories[ _elem ].sb, 'title' ] ),
					'http://' + $scope.markets[ $scope.market ].domain + '/wp-admin/themes.php?page=easy_sidebars',
					''
				),
				Feed: $scope.setCellObject(
					_idx,
					'feed',
					$scope.getFullDataValue( $scope.full_data[ $scope.market ].data, [ 'layouts', 'terms', _ids[ _idx ], 'layout', 'override' ] ),
					$scope.toFeedUrl( $scope.getFullDataValue( $scope.full_data[ $scope.market ].data, [ 'layouts', 'terms', _ids[ _idx ], 'layout', 'override' ] ) ),
					''
				),
				Video: $scope.setCellObject(
					_idx,
					'video',
					$scope.getFullDataValue( $scope.full_data[ $scope.market ].data, [ 'layouts', 'terms', _ids[ _idx ], 'layout', 'video_id' ] ),
					'',
					''
				),
				Advertorial: $scope.setCellObject(
					_idx,
					'advertorial',
					$scope.toSentenceCase( _advertorial.mode ),
					_advertorial.url,
					_advertorial.img
				),
			} );
			_count ++;
			if ( ( _count + 1 ) > _max ) {
				// sort and maybe group hierarchically
				$scope.table_data = _data;
			}
		} );
	};

	$scope.getMultipleCategory = function() {
		var _predata = {};
		var _max_markets = Object.keys( $scope.full_data ).length;
		var _max_categories = 0;
		var _count_markets = 0;
		var _count_categories = 0;
		Object.keys( $scope.full_data ).forEach( function( _market, _midx, _mids ) {
			_count_markets ++;
			_count_categories = 0;
			_max_categories = Object.keys( $scope.full_data[ _market ].data.categories ).length;
			Object.keys( $scope.full_data[ _market ].data.categories ).forEach( function( _elem, _idx, _ids ) {
				_count_categories ++;
				if ( ! angular.isObject( _predata[ $scope.full_data[ _market ].data.categories[ _elem ].slug ] ) ) {
					_predata[ $scope.full_data[ _market ].data.categories[ _elem ].slug ] = { catid: $scope.full_data[ _market ].data.categories[ _elem ].id };
				}
				_predata[ $scope.full_data[ _market ].data.categories[ _elem ].slug ][ _market ] = 1;
				if ( ( _max_categories === _count_categories ) && ( _max_markets === _count_markets ) ) {
					console.log( _predata );
					// now display in table
					var _data = [];
					var _count = 0;
					var _max = Object.keys( _predata ).length;
					Object.keys( _predata ).forEach( function( _slug, _idx ) {
						var _obj = {
							Sort: _slug,
							Name: $scope.setCellObject(
								_idx,
								'slug',
								_slug,
								'',
								''
							),
						};
						Object.keys( $scope.markets ).forEach( function( _mslug, _midx ) {
							if ( 1 === _predata[ _slug ][ _mslug ] ) {
								_obj[ $scope.markets[ _mslug ].name ] = $scope.setCellObject( _idx, _mslug, 'Y', $scope.getTermUrl( _predata[ _slug ]['catid'], 'category', _mslug ), '' );
							} else {
								_obj[ $scope.markets[ _mslug ].name ] = $scope.setCellObject( _idx, _mslug, '', '', '' );
							}
						} );
						_data.push( _obj );
						_count ++;
						if ( ( _count + 1 ) > _max ) {
							// sort and maybe group hierarchically
							$scope.table_data = _data;
						}
					} );
				}
			} );
		} );
	};
	
	// get data from JSON - repeat this to get multiple markets
	Object.keys( $scope.markets ).forEach( function( _elem, _idx ) {
		//var _url = '/json/' + _elem + '.json';
		// need cross domain version
		var _url = 'json/json.php?mkt=' + _elem;
		$http( {
			method: 'GET',
			url: _url
		} ).then(
			function successCallback( response ) {
				$scope.full_data[ _elem ] = response;
				console.log( $scope.full_data );
			},
			function errorCallback( response ) {}
			);
	} );

	$scope.toSentenceCase = function( _txt ) {
		if ( 1 < _txt.length ) {
			return _txt.charAt( 0 ).toUpperCase() + _txt.substr( 1, 1000 ).toLowerCase();
		} else {
			return _txt.toUpperCase();
		}
	};

	$scope.toFeedUrl = function( _url ) {
		if ( 0 < 1 * _url ) {
			_url = 'http://app.canada.com/SouthPARC/service.svc/Content?callingSite=' + $scope.markets[ $scope.market ].domain + '&contentId=' + _url + '&format=atom&AllLinks=false&maxdocs=40';
		}
		return _url;
	}

	$scope.getTermUrl = function( _id, _typ, _market ) {
		return 'http://' + $scope.markets[ _market ].domain + '/wp-admin/edit-tags.php?action=edit'
		 + '&taxonomy=' + ( 'post_tag' === _typ ? 'post_tag' : 'category' )
		 + '&tag_ID=' + _id + '&post_type=post';
	};

	$scope.getMenuUrl = function( _id, _domain ) {
		return 'http://' + _domain + '/wp-admin/nav-menus.php?action=edit' + '&menu=' + _id;
	};

	$scope.getFullDataValue = function( _obj, _props ) {
		var _val = '';
		var _count = 0;
		_props.forEach( function( _prop, _idx, _ary ) {
			if ( 'undefined' !== typeof _obj[ _prop ] ) {
				_obj = _obj[ _prop ];
				_count ++;
				if ( _ary.length === _count ) {
					_val = _obj;
				}
			}
		} );
		return _val;
	};

	$scope.tableToExcel = ( function () {
		var _uri = 'data:application/vnd.ms-excel;base64,';
		var _template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
		var _base64 = function ( s ) {
			return window.btoa( unescape( encodeURIComponent( s ) ) );
		};
		var _format = function ( s, c ) {
			return s.replace( /{(\w+)}/g, function (m, p) { return c[p]; } );
		};
		return function() {
			var _ctx = {
				worksheet: $scope.modes[ $scope.mode ],
				table: document.getElementById( 'pn_cp_report_wrapper' ).innerHTML
			}
			document.getElementById( 'pn_cp_download_link' ).href = _uri + _base64( _format( _template, _ctx ) );
			document.getElementById( 'pn_cp_download_link' ).download = 'corepress_' + $scope.market + '.xls';
			document.getElementById( 'pn_cp_download_link' ).click();
		};
	} )();

} );
