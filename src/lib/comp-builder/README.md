# Component Builder

Component builder removes or minimizes boiler plate code that comes with using React and Redux by
providing higher order components, HOC.
More importantly, this module contains a component builder factory that makes it easy to create
and compose custom component builders, HOCs, from existing or custom transformations.

## How a component builder works.

TODO: Need to rewrite this section to up to date with `React.Component` based classes.


## Factory

## Built-in Builders

* [Reduxer](./doc/Reduxer.md)

## Transformations

### Spec

[spec](spec/README.md)

Built-in transformations for ReactClass specification objects.

### Comp
[comp](comp/README.md)

Built-in transformations for React Component objects.

## Component attributes

componentConnect
  shape:
  ```
    {
      state: <func or {}>,
      actions: <func or {}>
    }
  ```

#### Examples:

    // Use traditional connect style functions:
    static componentConnect = {
        state: (state) => {
        return {
            teams: state.team.get('teams'),
            rosters: state.tavata.get('rosters')
        }
        },
        actions:(dispatch) => {
        return {
            actions: {
                team: bindActionCreators(teamActions, dispatch),
                notify: bindActionCreators(notifyActions, dispatch)
            }
        }
        }
    }

    // Use a declarative connect style. Also supports a short declaration via
    // an empty string, '', value. The following will create a prop `tavatas` that maps
    // to `state.tavatas`
    static componentConnect = {
        state: {
            teams: 'team.teams',
            rosters: 'tavata.rosters',
            tavatas: ''
        },
        actions: {
        team: teamActions,
        notify: notifyActions
        }
    }

    // Also supports mapStateToProps style functions at the prop level:
    static componentConnect = {
        state: {
            teams: (s) => s.team.get('teams'),
            rosters: (s) => s.tavata.get('rosters')
        },
        actions: {
            team: teamActions,
            notify: notifyActions
        }
    }

    // You can mix mapStateToProps style functions at the prop level with path declarations:
    static componentConnect = {
        state: {
            teams: 'team.teams',
            rosters: (s) => s.tavata.get('rosters')
        },
        actions: {
            team: teamActions,
            notify: notifyActions
        }
    }
