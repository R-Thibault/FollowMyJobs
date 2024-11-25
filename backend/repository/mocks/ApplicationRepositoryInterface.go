// Code generated by mockery v2.46.3. DO NOT EDIT.

package mocks

import (
	models "github.com/R-Thibault/FollowMyJobs/backend/models"
	mock "github.com/stretchr/testify/mock"
)

// ApplicationRepositoryInterface is an autogenerated mock type for the ApplicationRepositoryInterface type
type ApplicationRepositoryInterface struct {
	mock.Mock
}

// DeleteApplication provides a mock function with given fields: application
func (_m *ApplicationRepositoryInterface) DeleteApplication(application models.Application) error {
	ret := _m.Called(application)

	if len(ret) == 0 {
		panic("no return value specified for DeleteApplication")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(models.Application) error); ok {
		r0 = rf(application)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// GetApplicationByID provides a mock function with given fields: applicationID
func (_m *ApplicationRepositoryInterface) GetApplicationByID(applicationID uint) (*models.Application, error) {
	ret := _m.Called(applicationID)

	if len(ret) == 0 {
		panic("no return value specified for GetApplicationByID")
	}

	var r0 *models.Application
	var r1 error
	if rf, ok := ret.Get(0).(func(uint) (*models.Application, error)); ok {
		return rf(applicationID)
	}
	if rf, ok := ret.Get(0).(func(uint) *models.Application); ok {
		r0 = rf(applicationID)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*models.Application)
		}
	}

	if rf, ok := ret.Get(1).(func(uint) error); ok {
		r1 = rf(applicationID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetApplicationsByUserID provides a mock function with given fields: userID
func (_m *ApplicationRepositoryInterface) GetApplicationsByUserID(userID uint) ([]*models.Application, error) {
	ret := _m.Called(userID)

	if len(ret) == 0 {
		panic("no return value specified for GetApplicationsByUserID")
	}

	var r0 []*models.Application
	var r1 error
	if rf, ok := ret.Get(0).(func(uint) ([]*models.Application, error)); ok {
		return rf(userID)
	}
	if rf, ok := ret.Get(0).(func(uint) []*models.Application); ok {
		r0 = rf(userID)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]*models.Application)
		}
	}

	if rf, ok := ret.Get(1).(func(uint) error); ok {
		r1 = rf(userID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// SaveApplication provides a mock function with given fields: appDatas
func (_m *ApplicationRepositoryInterface) SaveApplication(appDatas models.Application) error {
	ret := _m.Called(appDatas)

	if len(ret) == 0 {
		panic("no return value specified for SaveApplication")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(models.Application) error); ok {
		r0 = rf(appDatas)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateApplication provides a mock function with given fields: appDatas
func (_m *ApplicationRepositoryInterface) UpdateApplication(appDatas models.Application) (*models.Application, error) {
	ret := _m.Called(appDatas)

	if len(ret) == 0 {
		panic("no return value specified for UpdateApplication")
	}

	var r0 *models.Application
	var r1 error
	if rf, ok := ret.Get(0).(func(models.Application) (*models.Application, error)); ok {
		return rf(appDatas)
	}
	if rf, ok := ret.Get(0).(func(models.Application) *models.Application); ok {
		r0 = rf(appDatas)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*models.Application)
		}
	}

	if rf, ok := ret.Get(1).(func(models.Application) error); ok {
		r1 = rf(appDatas)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// NewApplicationRepositoryInterface creates a new instance of ApplicationRepositoryInterface. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewApplicationRepositoryInterface(t interface {
	mock.TestingT
	Cleanup(func())
}) *ApplicationRepositoryInterface {
	mock := &ApplicationRepositoryInterface{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
