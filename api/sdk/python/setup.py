from setuptools import setup, find_packages

setup(
    name="tindur-sdk",
    version="1.0.0",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "requests>=2.25.0",
    ],
    author="Tindur Dev Team",
    description="Python SDK for Tindur Partner API",
)