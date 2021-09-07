import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css'
import { TiPlus, TiMinus } from "react-icons/ti";

export default function Profile() {


    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('')
    const [searchFilter, setSearchFilter] = useState([])
    const [expand, setExpand] = useState([])


    useEffect(() => {
        fetch("https://www.hatchways.io/api/assessment/students")
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setStudents(result.students);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [])

    useEffect(() => {
        setSearchFilter(
            students.filter(s => {
                return s.firstName.toUpperCase().includes(search.toUpperCase())
                    || s.lastName.toUpperCase().includes(search.toUpperCase());
            })
        )
    }, [search, students]);

    const toggleOpen = (id) => {
        if (expand.includes(id)) {
            setExpand(expand.filter(sid => sid !== id))
        } else {
            let newOpen = [...expand]
            newOpen.push(id)
            setExpand(newOpen)
        }
    }



    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!loaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className={styles.container}>
                <div className={styles.main}>

                    <ul >
                        <form className={styles.fixed}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Search by name"
                                onChange={e => setSearch(e.target.value)}
                            />
                            <hr className={styles.hr}></hr>
                        </form>
                        {searchFilter.map(student => (
                            <li className={styles.studentWrap} key={student.id}>
                                <div className={styles.box}>
                                    <div className={styles.box1}>
                                        <img src={student.pic} alt="student"></img>
                                    </div>
                                    <div className={styles.box2}>
                                        <h1>{student.firstName.toUpperCase()}  {student.lastName.toUpperCase()}</h1>
                                        <div className={styles.details}>
                                        <p>Email: {student.email}</p>
                                        <p>Company: {student.company}</p>
                                        <p>Skill: {student.skill}</p>
                                        <p>Average: {(student.grades.reduce((a, b) => parseInt(b) + a, 0))
                                            / (student.grades.map((grade) => grade).length)}%
                                        </p>
                                        </div>
                                        </div>
                                        <a className={styles.box4}onClick={() => toggleOpen(student.id)}><span >{expand.includes(student.id) ? <TiMinus /> : <TiPlus />}</span></a>
                                        {expand.includes(student.id) ? (
                                            <ul className={styles.box3}>
                                                {student.grades.map((grade, index) => <li key={grade.id}>Test {index + 1}: <span>{grade}%</span> </li>)}
                                            </ul>) : null}
                                    

                                    
                                </div>
                            </li>
                        ))
                        }

                    </ul >
                </div>
            </div>
        );

    }
};
