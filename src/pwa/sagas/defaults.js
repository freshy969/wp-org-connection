/* eslint-disable camelcase */
import { takeLatest } from 'redux-saga';
import { put, select, take, call, fork } from 'redux-saga/effects';
import * as actions from '../actions';
import * as deps from '../deps';

export function* router() {
  const query = yield select(deps.selectors.getURLQueries);
  const { p, cat, tag, author, page_id, s, attachment_id } = query;
  if (p) yield put(actions.postRequested({ id: p, current: true }));
  else if (cat) yield put(actions.newPostsListRequested({ params: { categories: cat } }));
  else if (tag) yield put(actions.newPostsListRequested({ params: { tags: tag } }));
  else if (author) yield put(actions.newPostsListRequested({ params: { author } }));
    // else if (y || m) yield put(actions.archiveRequested({ params: {  } }));
  else if (page_id) yield put(actions.pageRequested({ id: page_id, current: true }));
  else if (s) yield put(actions.newPostsListRequested({ params: { search: s } }));
  else if (attachment_id)
    yield put(actions.attachmentRequested({ id: attachment_id, current: true }));
  else
    yield put(actions.newPostsListRequested());
}

export function* doFirstRequest() {
  yield take(deps.types.INITIAL_PACKAGES_ACTIVATED);
  yield call(router);
}

export default function* defaultsSaga() {
  yield [ fork(doFirstRequest), takeLatest(deps.types.ROUTER_DID_CHANGE, router) ];
}
