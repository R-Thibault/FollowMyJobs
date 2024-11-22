// Code generated by mockery v2.46.3. DO NOT EDIT.

package mocks

import (
	models "github.com/R-Thibault/FollowMyJobs/backend/models"
	mock "github.com/stretchr/testify/mock"
)

// UserServiceInterface is an autogenerated mock type for the UserServiceInterface type
type UserServiceInterface struct {
	mock.Mock
}

// GetUserByEmail provides a mock function with given fields: email
func (_m *UserServiceInterface) GetUserByEmail(email string) (*models.User, error) {
	ret := _m.Called(email)

	if len(ret) == 0 {
		panic("no return value specified for GetUserByEmail")
	}

	var r0 *models.User
	var r1 error
	if rf, ok := ret.Get(0).(func(string) (*models.User, error)); ok {
		return rf(email)
	}
	if rf, ok := ret.Get(0).(func(string) *models.User); ok {
		r0 = rf(email)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*models.User)
		}
	}

	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(email)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// NewUserServiceInterface creates a new instance of UserServiceInterface. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewUserServiceInterface(t interface {
	mock.TestingT
	Cleanup(func())
}) *UserServiceInterface {
	mock := &UserServiceInterface{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
