package models

import "errors"

type User struct {
	Id          int     `json:"id"`
	UserId      string  `json:"userId"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
	Password    string  `json:"password"`
	IsVerified  bool    `json:"isVerified"`
}

type UserResponse struct {
	UserId         string  `json:"userId"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	IsVerified     bool    `json:"isVerified"`
	QuizCompleted  int     `json:"quizCompleted"`
	AverageScore   int     `json:"averageScore"`
	Rank           string  `json:"rank"`
	TotalPoints    int     `json:"totalPoints"`
}

func (user *User) Validate() error {
	if user.Name == "" {
		return errors.New("name is not missing")
	} else if user.Email == "" {
		return errors.New("email is missing")
	} else if user.Password == "" {
		return errors.New("password is missing")
	} else if len(user.Password) < 8 {
		return errors.New("password is too short")
	}
	return nil
}

func (user *User) LoginValidate() error {
	if user.Email == "" {
		return errors.New("email is missing")
	} else if user.Password == "" {
		return errors.New("password is missing")
	} else {
		return nil
	}
}

func (user *User) PasswordValidate() error {
	if user.Password == "" {
		return errors.New("password is missing")
	}
	return nil
}

func (user *User) EmailValidate() error {
	if user.Email == "" {
		return errors.New("email is missing")
	}
	return nil
}

func (user *User) IdValidate() error {
	if user.UserId == "" {
		return errors.New("id is missing")
	}
	return nil
}